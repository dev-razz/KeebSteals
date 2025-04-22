import {createSupabaseClient} from "../database/supabase.js";
//import fs
import fs from 'fs';

// Helper function to format price (assuming input is in cents)
const formatPrice = (priceInCents) => {
    if (typeof priceInCents !== 'number') return null;
    return (priceInCents / 100).toFixed(2); // Convert to dollars/euros etc.
};


const getData = async (product_link) => {
    const response = await fetch(product_link+".js");
    if (!response.ok) {
        throw new Error(`Failed to fetch product data: ${response.statusText}`);
    }
    const product = await response.json();
    const formatted_data = {
    product_id: product.id,
    title: product.title,
    brand: product.vendor,
    category: product.type,
    product_link: product_link,
    product_description: [
        ...product.description.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)
      ].map(m =>
        // strip any inner tags (like <img>) and trim
        m[1].replace(/<[^>]+>/g, '').trim()
      ),
    tags: product.tags,
    
    // Simplified price info
    current_price: formatPrice(product.price),
    original_price: formatPrice(product.compare_at_price),
    price_range: [formatPrice(product.price_min), formatPrice(product.price_max)],

    // images
    images: [...new Map(product.variants.map(v => [v.option1, {
        title: v.option1,
        imageUrl: v.featured_image?.src,
      }])).values()],
    };
    return formatted_data
}


//Read from product_links.json
let product_links = fs.readFileSync('./api/product_links.json', 'utf8')
product_links = JSON.parse(product_links);
const supabase = createSupabaseClient();

//loop through each link
for(let link of product_links) {
    //get data from link
    let full_link = "https://epomaker.com"+link
    console.log("Fetching data from: ", full_link);
    const product = await getData(full_link);
    console.log("Fetched data: ",product);
    //upload to supabase
    const { data, error } = await supabase
        .from('product')
        .upsert([product], { 
            onConflict: 'product_id',
            ignoreDuplicates: false 
        });

    if (error) {
        console.error('Error uploading data:', error);
    } else {
        console.log('Data uploaded successfully:', data);
    }
}