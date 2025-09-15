

export const ConsultationSchema= new Schema({
    resercherId:{type:Types.objectId , ref:"User"},
    doctorId:{type:Types.objectId , ref:"User"},
    date:{type:Date},
    startTime: { type: Date},
    endTime: { type: Date},
    purpose:{type:String},
    description:{type:String},
    status:{type:string , enum:["pending","upcominng","past"], default:"pending"},

},
{
    timestamps: true
})