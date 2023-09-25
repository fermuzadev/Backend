//CRUD JSON 
//Entregable 2 BackEnd Coder

const { promises:fs} = require('fs');

//Class ProductManager
class ProductManager {
    constructor(path) {
        this.path = path;
    }
    
    getProducts() {
        return getJSONFromFile(this.path);
    }
    
    async addProduct(product) {
        const { title, description, price, thumbnail, code, stock} = product;
        if (!title || !description || !price || !thumbnail || !code || !stock ){
            console.log(`Error: One or more field is empty, the product wasn't add`)    
        }
        const products = await getJSONFromFile(this.path);
            if(products.find(prod => prod.code ===code)) {
                console.log(`Error: The product code ${code} already exists`)
            }else{
                products.push({
                    id: products.length + 1,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                });
                await saveJSONToFile(this.path, products);
                console.log(`Product code ${code} its added`)
            }
    }

    async getProductById(id) {
        const products = await getJSONFromFile(this.path);
        let product = products.find((prod) => prod.id === id);
        if (!product) {
            let noEncontrado = `The product with id ${id} doesn't exist`;
            console.log(noEncontrado);
        } else {
            console.log(`The product with ID ${id} is : `,product);
        }
    }
    
    async deleteProduct(id) {
        const products = await getJSONFromFile(this.path);
        let productToDelete = products.find(prod => prod.id === id)
        if(!productToDelete){
            console.log('The product doesn`t exist')
        }else {
            products.splice(id -1 , 1)
            saveJSONToFile(this.path, products);
            console.log("The product has been removed")
        }
    }


    async updateProduct(id, updTitle, updDescription, updPrice, updThumbnail, updCode, updStock ) {
        const products = await getJSONFromFile(this.path);
        let findProduct = products.find(prod => prod.id === id)
        if (!findProduct) {
            console.log(`Product not found`)
        } else if (!id) {
            console.log('The ID is wrong');
        }else {
            let updatedProducts = [{ 
                id: id,
                title: updTitle,
                description : updDescription,
                price: updPrice,
                thumbnail: updThumbnail,
                code: updCode,
                stock: updStock
            }]
            await saveJSONToFile(this.path, updatedProducts);
            console.log("Products updated")
        }

        }
    }



//End Product Manager Class

const existFile = async (path) => {
    try {
        await fs.access(path);
        return true;
    }catch(error) {
        return false; 
    }
}


const getJSONFromFile = async (path) => {
    if (!await existFile(path)) {
        return [];
    }else{
        let content;
        try {
            content = await fs.readFile(path, 'utf-8');  
        }catch (error) {
            throw new Error(`The file ${path} could not be read`)
        }
        try {
            return JSON.parse(content);
        } catch (error) {
            throw new Error(`The file ${path} hasn't a JSON format`)
        }
    }
}

const saveJSONToFile = async (path, data) => {
    const content = JSON.stringify(data, null, '\t');
    try {
        await fs.writeFile(path, content, 'utf-8');
    }catch (error) {
        throw new Error(`The file ${path} couldn't be write`)
    }
}


//Testing

const testingJSON = async () => {
    try {
        const testingProducts = new ProductManager("./data.json");
        let initial = await testingProducts.getProducts();
        console.log('The products are : ' ,  initial)
        await testingProducts.addProduct({
            title: "producto prueba",
            description: "Este es un producto prueba",
            price: 200,
            thumbnail: "sin imagen",
            code: "abc123",
            stock: 25
        });
        const products = await testingProducts.getProducts();
        console.log("getProducts", 'The products are: ', products);
        testingProducts.getProductById(1)
        testingProducts.getProductById(2)  //No existe 
        await testingProducts.updateProduct(1, "probando", 10 , "probando", 1231, 50, 50 )
        await testingProducts.deleteProduct(1) 
    } catch (error) {
        console.error(' Error: ', error.message);
    }
};

testingJSON()