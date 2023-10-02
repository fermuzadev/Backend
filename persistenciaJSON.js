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
        if (!(title && description && price && thumbnail && code && stock)){
            console.log(`Add Error: One or more field is empty, the product wasn't add`)    
        }else {
            const products = await getJSONFromFile(this.path);
            if(products.find(prod => prod.code ===code)) {
                console.log(`Add Error: The product code ${code} already exists`)
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
    }

    async getProductById(id) {
        const products = await getJSONFromFile(this.path);
        let product = products.find((prod) => prod.id === id);
        if (!product) {
            let noEncontrado = `The product with id ${id} doesn't exists`;
            return noEncontrado;
        } else {
            console.log('GetID' , product)
            return product;
        }
    }
    
    async deleteProduct(id) {
        const products = await getJSONFromFile(this.path);
        let productToDelete = products.find(prod => prod.id === id)
        if(!productToDelete){
            console.log('Delete Error : The product doesn`t exists')
        }else {
            let filterProd = products.filter(p => p.id !== id)
            saveJSONToFile(this.path, filterProd);
            console.log("The product has been removed")
        }
    }


    async updateProduct(id, updTitle, updDescription, updPrice, updThumbnail, updCode, updStock ) {
        const products = await getJSONFromFile(this.path);
        let findProduct = products.find(prod => prod.id === id)
        if (!findProduct || !id) {
            console.log(`Product id ${id} not found`)
            return;
        } else if (products.find(p =>  p.code === updCode)){
            console.log(`Code ${updCode} already exists`);
            return;
        }else {
            if (!(updTitle && updDescription && updPrice && updThumbnail && updCode && updStock)){
                console.log(`Update Error: One or more field is empty, the product wasn't updated`)
                return;
            }else{
            let filterProd = products.filter(p => p.id !== id)
            let updatedProducts = [...filterProd, {  
                id: id,
                title: updTitle,
                description : updDescription,
                price: updPrice,
                thumbnail: updThumbnail,
                code: updCode,
                stock: updStock
            }]
            console.log('Updated with spread? ', updatedProducts)
            await saveJSONToFile(this.path, updatedProducts);
            console.log("Products updated")
            }
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
        testingProducts.getProductById(4) //Not found 
        await testingProducts.updateProduct(2, undefined, 10 )  //Test sin campos o undefined con update 
        await testingProducts.updateProduct(1, "producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc123", 500) //Duplicar Code en Update
        await testingProducts.addProduct({title: "t", description: "d", price: 1, thumbnail: "t", code: "123456", stock: 30 })
        await testingProducts.deleteProduct(1)
        await testingProducts.deleteProduct(2) 
        await testingProducts.deleteProduct(3) 
    } catch (error) {
        console.error(' Error: ', error.message);
    }
};

testingJSON()