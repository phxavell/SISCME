import {z} from 'zod'

// @ts-ignore
export const vehicleFormSchema = z.object({
	id: z.number().optional(),
	marca: z.string().nonempty(`Campo obrigatório`),
	modelo: z.string().nonempty(`Campo obrigatório`),
	placa: z.string().nonempty(`Campo obrigatório`),
	descricao: z.string(),
	// @ts-ignore
	foto: z.array(z.instanceof(FileList)),


	// .partial().superRefine((data, ctx) => {
	//     console.log('superRefine',data)
	//     // if (!data.first && !data.second) {
	//     //     ctx.addIssue({
	//     //         code: z.ZodIssueCode.custom,
	//     //         path: ["second"],
	//     //         message: "Second should be set if first isn't",
	//     //     });
	//     // }
	// })

})

export type VehicleFormSchemaType = z.infer<typeof vehicleFormSchema>
