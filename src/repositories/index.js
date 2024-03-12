import { UsersDao } from "../dao/factory.js";
import CartsDao from "../dao/carts.dao.js";
import MessagesDao from "../dao/messages.dao.js";
import ProductsDao from "../dao/products.dao.js";
import CartsRepository from "./cart.repository.js";
import UsersRepository from "./users.repository.js";
import ProductsRepository from "./products.repository.js";
import MessagesRepository from "./messages.repository.js";


export const cartsRepository = new CartsRepository(new CartsDao());

export const usersRepository = new UsersRepository(new UsersDao())

export const productsRepository = new ProductsRepository(new ProductsDao())

export const messagesRepository = new MessagesRepository(new MessagesDao())