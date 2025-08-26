export class Branch {
    public id?: string;
    public name: string;
    public address: string;
    public city: string;
    public business: string;

    constructor(name: string, address: string, city:string, business: string, id?: string){
        this.name = name;
        this.address = address;
        this.city = city;
        this.business = business;
        this.id = id;
    }
}