class ProductManager {
    constructor() {
        this.products = [];
    }
    
    getProducts() {
        console.log('Products : ', this.products);
    }
    
    addProduct(title, description, price, thumbnail, code, stock) {
        if(this.products.find(product => product.code ===code)) {
            console.log(`Error: The product code ${code} already exists`)
        }else if(title===undefined || description===undefined || price===undefined || thumbnail===undefined || code===undefined || stock===undefined ){
            console.log('Error: One or more field is empty, the product is not added')    
        }else{
            this.products.push({
                id: this.products.length + 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            });
            console.log(`Product code ${code} its added`)
        }
    }
    getProductById(id) {
        this.products.find(product=> {product.id === id ? console.log(product) : console.log(`Error: The product id ${id} is not found`)})
    }
}

products = new ProductManager();
products.getProducts()

products.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)
products.getProducts()

products.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)
products.getProducts()

products.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen')
products.getProducts()

products.getProductById(2)
products.getProductById(1)