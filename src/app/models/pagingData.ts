
export class PagingDaa {
    currentPage:number
nextPage:boolean
pageSize:number
previousPage:boolean
totalCount:number
totalPages:number

    constructor(currentPage:number,nextPage:boolean, pageSize: number,previousPage:boolean, totalCount: number,totalPages:number) {
        this.currentPage=currentPage
        this.nextPage=nextPage
        this.pageSize=pageSize
        this.previousPage=previousPage
        this.totalCount=totalCount
        this.totalPages=totalPages
    }
}