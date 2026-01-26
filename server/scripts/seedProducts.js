const { db } = require('../config/firebaseServer');


const menuData = [
    {
        categoryName: 'Drinks',
        items: [
            { name: 'Coca Cola', price: 13 },
            { name: 'Coca Cola Zero', price: 13 },
            { name: 'Fanta Orange', price: 13 },
            { name: 'Sprite', price: 13 },
            { name: 'Still Water', price: 10 },
            { name: 'Sparkling Water', price: 12 },
            { name: 'Fresh Lemonade', price: 18 },
            { name: 'Iced Tea', price: 15 },
            { name: 'Orange Juice', price: 16 },
            { name: 'Apple Juice', price: 16 },
            { name: 'Espresso', price: 9 },
            { name: 'Cappuccino', price: 14 },
            { name: 'Latte', price: 15 },
            { name: 'Hot Chocolate', price: 16 }
        ]
    },
    {
        categoryName: 'Burger',
        items: [
            { name: 'Classic Burger', price: 35 },
            { name: 'Vegan Burger', price: 38 },
            { name: 'Cheeseburger', price: 32 },
            { name: 'Cheeseburger XL', price: 40 },
            { name: 'Double Smash Burger', price: 45 },
            { name: 'Bacon Burger', price: 40 },
            { name: 'Mushroom Swiss Burger', price: 42 },
            { name: 'BBQ Burger', price: 43 },
            { name: 'Spicy Chicken Burger', price: 36 },
            { name: 'Fish Burger', price: 37 },
            { name: 'Vegan Delight', price: 38 }
        ]
    },
    {
        categoryName: 'Pasta',
        items: [
            { name: 'Pasta Carbonara', price: 34 },
            { name: 'Pasta Quattro Formaggi', price: 36 },
            { name: 'Pasta Bolognese', price: 32 },
            { name: 'Pasta Alfredo', price: 35 },
            { name: 'Pasta Arrabiata', price: 30 },
            { name: 'Pasta Pesto', price: 33 },
            { name: 'Pasta Aglio e Olio', price: 28 },
            { name: 'Pasta Marinara', price: 38 }
        ]
    },
    {
        categoryName: 'Pizza',
        items: [
            { name: 'Pizza Margherita', price: 30 },
            { name: 'Pizza Pepperoni', price: 35 },
            { name: 'Pizza Quattro Stagioni', price: 38 },
            { name: 'Pizza Diavola', price: 36 },
            { name: 'Pizza Vegetariana', price: 34 },
            { name: 'Pizza Prosciutto', price: 37 },
            { name: 'Pizza Quattro Formaggi', price: 40 }
        ]
    },
    {
        categoryName: 'Sides',
        items: [
            { name: 'French Fries', price: 12 },
            { name: 'Sweet Potato Fries', price: 15 },
            { name: 'Onion Rings', price: 14 },
            { name: 'Mozzarella Sticks', price: 16 },
            { name: 'Garlic Bread', price: 10 },
            { name: 'Coleslaw', price: 8 }
        ]
    },
    {
        categoryName: 'Salads',
        items: [
            { name: 'Caesar Salad', price: 28 },
            { name: 'Greek Salad', price: 26 },
            { name: 'Caprese Salad', price: 25 },
            { name: 'Garden Salad', price: 22 },
            { name: 'Chicken Salad', price: 32 },
            { name: 'Tuna Salad', price: 30 }
        ]
    },
    {
        categoryName: 'Desserts',
        items: [
            { name: 'Tiramisu', price: 20 },
            { name: 'Chocolate Cake', price: 18 },
            { name: 'Cheesecake', price: 22 },
            { name: 'Panna Cotta', price: 19 },
            { name: 'Ice Cream', price: 15 },
            { name: 'Apple Pie', price: 17 },
            { name: 'Brownie', price: 16 }
        ]
    }
];

async function seedProducts() {
    try {
        
        
        const categoriesRef = db.collection('categories');
        const productsRef = db.collection('products');
        
 
        const categoriesSnapshot = await categoriesRef.get();
        
        if (categoriesSnapshot.empty) {
          
            console.log('Run: node scripts/seedCategories.js');
            process.exit(1);
        }
        
   
        const categoryMap = new Map();
        categoriesSnapshot.forEach(doc => {
            const data = doc.data();
            categoryMap.set(data.name, {
                id: doc.id,
                name: data.name
            });
        });
        
       
        categoryMap.forEach((info, name) => {
            console.log(`   • ${name} (${info.id})`);
        });
    
        
        let totalAdded = 0;
        const summary = [];
        
   
        for (const section of menuData) {
            const categoryInfo = categoryMap.get(section.categoryName);
            
            if (!categoryInfo) {
     
                continue;
            }

            
            let addedForCategory = 0;
            
        
            for (const item of section.items) {
                const now = new Date().toISOString();
                
                const productData = {
                    name: item.name,
                    price: item.price,
                    category: {
                        id: categoryInfo.id,
                        name: categoryInfo.name
                    },
                    createdAt: now,
                    updatedAt: now
                };
                
       
                await productsRef.add(productData);
   
                totalAdded++;
                addedForCategory++;
            }
            
            summary.push({
                category: section.categoryName,
                count: addedForCategory
            });
            
            console.log('');
        }
        
  
        
        summary.forEach(item => {
            console.log(`${item.category}: ${item.count} products`);
        });
        
       
      
        const verifySnapshot = await productsRef.get();
       
        
        process.exit(0);
        
    } catch (error) {
      
        console.error('Error details:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    }
}






if (require.main === module) {
    const args = process.argv.slice(2);
    
    (async () => {
        try {
            
       await seedProducts();
            
        } catch (error) {
            console.error('Fatal error:', error);
            process.exit(1);
        }
    })();
}

module.exports = { seedProducts };