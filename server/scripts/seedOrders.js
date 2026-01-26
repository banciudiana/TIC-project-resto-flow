const { db } = require('../config/firebaseServer');


const FIXED_WAITER_ID = "Y542konPJZVxdgF4KoKQ";
const FIXED_CHEF_ID = "vdWaxlfAVp4zIJVN4qWl";


function getRandomDateInLastDays(days) {
    const now = new Date();
    const past = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
    return new Date(randomTime);
}


function getStatusBasedOnAge(createdDate) {
    const now = new Date();
    const created = new Date(createdDate);
    const hoursAgo = (now - created) / (1000 * 60 * 60);
    
    
    if (hoursAgo > 2) {
        return Math.random() > 0.95 ? 'CANCELLED' : 'DELIVERED';
    }
    

    if (hoursAgo > 1) {
        return Math.random() > 0.3 ? 'DELIVERED' : 'READY';
    }
    
    
    if (hoursAgo > 0.5) {
        const rand = Math.random();
        if (rand > 0.7) return 'DELIVERED';
        if (rand > 0.4) return 'READY';
        return 'PREPARING';
    }
    

    const rand = Math.random();
    if (rand > 0.8) return 'READY';
    if (rand > 0.5) return 'PREPARING';
    return 'PENDING';
}


function getRandomTableNumber() {
    return Math.floor(Math.random() * 20) + 1; 
}

async function seedOrders() {
    try {
        
        
        const productsRef = db.collection('products');
        const ordersRef = db.collection('orders');
        
 
        const productsSnapshot = await productsRef.get();
        
        if (productsSnapshot.empty) {
          
            console.log('Run: node scripts/seedProducts.js');
            process.exit(1);
        }
        
      
        const allProducts = [];
        productsSnapshot.forEach(doc => {
            const data = doc.data();
            allProducts.push({
                id: doc.id, 
                name: data.name,
                price: data.price
            });
        });
        
        
        const orderDistribution = [
            { daysAgo: 30, count: 5 },   
            { daysAgo: 20, count: 8 },   
            { daysAgo: 15, count: 10 },  
            { daysAgo: 10, count: 12 },  
            { daysAgo: 7, count: 15 },   
            { daysAgo: 3, count: 20 },   
            { daysAgo: 1, count: 25 },  
            { daysAgo: 0, count: 30 }    
        ];
        
        let ordersCreated = 0;
      
        
        for (const period of orderDistribution) {
            
            for (let i = 0; i < period.count; i++) {
                
                const startOfPeriod = period.daysAgo;
                const endOfPeriod = period.daysAgo > 0 ? period.daysAgo - 1 : 0;
                
                const now = new Date();
                const start = new Date(now.getTime() - (startOfPeriod * 24 * 60 * 60 * 1000));
                const end = new Date(now.getTime() - (endOfPeriod * 24 * 60 * 60 * 1000));
                
                const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
                const createdDate = new Date(randomTime);
                
                
                const status = getStatusBasedOnAge(createdDate);
                
               
                let updatedDate;
                if (status === 'PENDING') {
                   
                    updatedDate = new Date(createdDate.getTime() + Math.random() * 10 * 60 * 1000); 
                } else if (status === 'PREPARING') {
                  
                    updatedDate = new Date(createdDate.getTime() + (10 + Math.random() * 20) * 60 * 1000); 
                } else if (status === 'READY') {
                
                    updatedDate = new Date(createdDate.getTime() + (30 + Math.random() * 30) * 60 * 1000);
                } else {
                   
                    updatedDate = new Date(createdDate.getTime() + (45 + Math.random() * 75) * 60 * 1000); 
                }
                
    
                const numberOfItems = Math.floor(Math.random() * 5) + 1;
                const selectedProducts = [];
                const usedIndices = new Set();
                
      
                while (selectedProducts.length < numberOfItems) {
                    const randomIndex = Math.floor(Math.random() * allProducts.length);
                    if (!usedIndices.has(randomIndex)) {
                        usedIndices.add(randomIndex);
                        const product = allProducts[randomIndex];
                        selectedProducts.push({
                            id: product.id,  
                            name: product.name,
                            price: product.price
                        });
                    }
                }
               
                const totalAmount = selectedProducts.reduce((sum, item) => sum + item.price, 0);
                
       
                const noteOptions = [
                    'fara gheata',
                    'fara ceapa',
                    'extra sos',
                    'bine prajit',
                    'picant',
                    'fara usturoi',
                    'mediu',
                    'fara maioneza'
                ];
                const notes = Math.random() > 0.7 ? noteOptions[Math.floor(Math.random() * noteOptions.length)] : '';
                
                
                const orderData = {
                    chefId: FIXED_CHEF_ID,
                    waiterId: FIXED_WAITER_ID,
                    tableNumber: getRandomTableNumber(),
                    items: selectedProducts,
                    totalAmount: totalAmount,
                    status: status,
                    notes: notes,
                    createdAt: createdDate.toISOString(),
                    updatedAt: updatedDate.toISOString()
                };
                
             
                await ordersRef.add(orderData);
                ordersCreated++;
                
               
            }
        }
        

        
        
        const verifySnapshot = await ordersRef.get();
  
        
     
        const statusCount = {};
        verifySnapshot.forEach(doc => {
            const status = doc.data().status;
            statusCount[status] = (statusCount[status] || 0) + 1;
        });
        
        console.log('Status Distribution:');
        Object.entries(statusCount).sort((a, b) => b[1] - a[1]).forEach(([status, count]) => {
            const percentage = ((count / verifySnapshot.size) * 100).toFixed(1);
    
        });
        
        process.exit(0);
        
    } catch (error) {
       
        console.error('Error details:', error.message);
        process.exit(1);
    }
}


if (require.main === module) {
    const args = process.argv.slice(2);
    
    (async () => {
        try {
            
                await seedOrders();
            
        } catch (error) {
            console.error('Fatal error:', error);
            process.exit(1);
        }
    })();
}

module.exports = { seedOrders };