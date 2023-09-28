class ProductManager {
    constructor() {
        this.products = [];
    }
    
    getProducts() {
        return this.products;
    }
    
    addProduct(title, description, price, thumbnail, code, stock) {
        if(this.products.find(product => product.code ===code)) {
            console.log(`Error: The product code ${code} already exists`)
        }else if(!title || !description || !price || !thumbnail || !code || !stock ){
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
        let product = this.products.find((prod) => prod.id === id);
        if (!product) {
            let noEncontrado = `The product with id ${id} doesn't exist`;
            return noEncontrado;
        } else {
            return product;
        }
    }
}
//Test
products = new ProductManager();
console.log('Products : ' , products.getProducts())

products.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)
console.log('Products : ' , products.getProducts())

products.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)
console.log('Products : ' , products.getProducts())

products.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen')
products.addProduct('', null, 200, '')
console.log('Products : ' , products.getProducts())

console.log('The find is : ',products.getProductById(2))
console.log('The find is : ' , products.getProductById(1))

