import { User } from "./user.model";
import { OrderData } from "./orderData";

export class CommentModel{
    constructor(
        public CommentId: number,
        public UserId: number,
        public OrderId: number,
        public Review: string,
        public PostedDate: Date,
        public Grade:number,
        public User:User,
        public Order:OrderData
    ){ }
}

