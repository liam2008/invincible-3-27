// 仓库信息
module.exports = {
	name: 'StoresHouses',
	schema: {
		name: {
			type: String,
			required: true,
			unique: true
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		updatedAt: {
			type: Date,
			default: Date.now
		}
	}
};