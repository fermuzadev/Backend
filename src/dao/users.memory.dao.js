export class UsersDao {
    constructor() {
        this.users =
        {
            "id": 1,
            "name": "Rick Sanchez",
            "status": "Alive",
            "species": "Human",
            "gender": "Male",
            "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg"
        }

    }
    static get() {
        return this.users
    }

    static getById(uid) {
        return this.users.find(user => user.id === uid)
    }
    static create(data) {
        const newUser = {
            id: this.users.length + 1,
            ...data
        }
        this.users.push(newUser)
        return newUser
    }
    static update(uid, data) {
        const index = this.users.findIndex(user => user.id === uid)
        this.users[index] = {
            ...this.users[index],
            ...data
        }
        return this.users[index]
    }
    static deleteById(uid) {
        const index = this.users.findIndex(user => user.id === uid)
        this.users.splice(index, 1)
        return this.users
    }

}