// daily-sync.js - API endpoint for Vercel cron jobs to update product data
import { createSupabaseClient } from "../database/supabase.js";

// Reuse the same formatPrice helper
const formatPrice = (priceInCents) => {
    if (typeof priceInCents !== 'number') return null;
    return (priceInCents / 100).toFixed(2);
};

// Reuse the existing getData function from upload-data.js
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
            ...product.description.matchAll(/<(h2|h3)[^>]*>([\s\S]*?)<\/\1>/g)
        ].map(m =>
            // strip any inner tags (like <img>) and trim
            m[2].replace(/<[^>]+>/g, '').trim()
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
        }])).values()]
    };
    return formatted_data;
};

async function dailySyncJob() {
    console.log(`=== Starting daily sync job at ${new Date().toISOString()} ===`);
    const supabase = createSupabaseClient();
    
    try {
        // 1. Get all product links from the database
        const { data: dbProducts, error: dbError } = await supabase
            .from('product')
            .select("product_link");
            
        if (dbError) throw dbError;
        
        console.log(`Found ${dbProducts.length} products in database`);
        
        // Extract product links into an array
        const dbProductLinks = dbProducts.map(item => item.product_link);
        console.log(dbProductLinks)
        
        // 4. Add new products to the database
        for (const link of dbProductLinks) {
            try {
                console.log(`Processing product: ${link}`);
                const productData = await getData(link);
                
                const { error: insertError } = await supabase
                    .from('product')
                    .upsert([productData], { 
                        onConflict: 'product_id',
                        ignoreDuplicates: false 
                    });
                    
                if (insertError) {
                    console.error(`Error adding product ${link}:`, insertError);
                } else {
                    console.log(`Successfully updated product: ${productData.title}`);
                }
            } catch (error) {
                console.error(`Failed to process new product ${link}:`, error.message);
            }
        }
        
        
    } catch (error) {
        console.error('Error in daily sync job:', error);
    }
    
    console.log(`=== Daily sync job completed at ${new Date().toISOString()} ===`);
    return { success: true };
}

// Export the handler function for Vercel serverless function
export default async function handler(req, res) {
    // Check if the request is from Vercel's cron system
    const userAgent = req.headers['user-agent'];
    const isVercelCron = userAgent === 'vercel-cron/1.0';
    
    // Only proceed if this is a GET request from Vercel cron or explicitly authorized
    if (req.method === 'GET' && (isVercelCron || process.env.NODE_ENV === 'development')) {
        try {
            await dailySyncJob();
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error in cron handler:', error);
            return res.status(500).json({ error: 'Failed to run sync job' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}