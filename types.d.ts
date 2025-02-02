import { Connection } from "mongoose"
declare global{
    var mongoose:{
        conne:Connection | null,
        promise: Promise<Connection> | null
    }
}
export {}