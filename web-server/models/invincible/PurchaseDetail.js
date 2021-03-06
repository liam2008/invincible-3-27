var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: "purchaseDetail",
    schema: {
    	order_number: String,												// 订单号			
        _id: Schema.Types.ObjectId,	
        store_sku: String,                                                  // 库存SKU
        unit_price: Number,                                                 // 单价
        purchase_quantity: Number,                                          // 采购数量
        total_price: Number,                                                // 总金额(含运费)
        contract_covenant_date: Date,                                       // 合同约定交期
        deliver_quantity: Array,                                            // 交货数量
        deliver_date: Array,                                                // 实际交期
        deliver_total: Number,  										    // 已交货数量
       	in_warehouse: Array, 												// 是否入库
       	in_batches: [{														// 是否分批
            time : String,
            number: Number
       	}], 													
       	logistics_number: String,                                           // 物流追踪单号
        salesman: Array,                                                    // 业务员
        remarks: Array,                                                     // 详细备注
        first_buy:Boolean,                                                  // 是否首次采购

        createdAt: Date,
        updatedAt: Date
    }
};