# Invincible ReadMe

## 前后端路由接口

### 用户管理

- 用户列表

  路由：/users

  方法：GET

  参数：无

  返回：

  ```json
  [
      {
        "_id":"用户id",
        "account":"用户名",
        "status":状态,
        "role":{
          "_id":"角色id",
          "name":"角色名",
          "type":"角色类型",
          "routes":[
            角色路由权限
          ]
        },
        "name":"用户姓名",
        "createdAt":"创建时间",
        "updatedAt":"更新时间",
        "team":小组id,
        "creator":{
account":"创建者用户          "id":"创建者id",
                                    "名",
          "name":"创建者姓名"
        }
      },
    {
        ...
    }
  ]
  ```

  ​

- 创建用户

  路由：/users

  方法：POST

  参数：

  | Key      | Description          |
  | -------- | -------------------- |
  | account  | 用户名（大小写字母、数字、下划线）    |
  | name     | 姓名                   |
  | password | 使用CryptoJS.MD5加密后的密码 |
  | role     | 角色的id                |
  | team     | 小组的id（可以为null）       |

  返回：

  ```json
  {
      
  }
  ```


- 编辑用户

  路由：/users/用户id

  方法：PUT

  参数：

  | Key      | Description          |
  | -------- | -------------------- |
  | account  | 用户名（用于验证）            |
  | name     | 姓名                   |
  | password | 使用CryptoJS.MD5加密后的密码 |
  | role     | 角色                   |
  | team     | 小组id                 |

  返回：

  ```json
  {
      
  }
  ```

  ​


### [purchase]采购管理

- 采购汇总表

  路由：/purchase/purList

  方法：GET

  参数：

  | Key            | Description |
  | -------------- | ----------- |
  | orderNumber    | 订单号         |
  | contractNumber | 合同号         |
  | supplierId     | 供应商Id       |
  | storeSku       | 库存SKU       |
  | proNameCn      | 商品中文名       |
  | orderStatus    | 订单基本状态      |
  | current        | 当前页码        |

  返回：

  ```json
  {
    purchases: [
    {
          "orderNumber":"订单号",
          "contractNumber":"合同号",
          "supplierName":"供应商名字",
          "purTotalPrice": 订单总金额,
          "orderStatus": "订单基本状态",
      "skuDetail": [
        {
          "storeSku": 库存sku,
          "nameCN"中文名:,
          "name":英文名
        },
    		{
    		    ...
    		}
      ]
      	"isDeclare": 是否报关,
    },
    {
        ...
    }
  ]，
      pageTotal:总数据量
  }
  ```


- 新增采购单

  路由：/purchase/purSave

  方法：POST

  参数：

  | Key            | Description             |
  | -------------- | ----------------------- |
  | orderNumber    | 订单号                     |
  | contractNumber | 合同号                     |
  | supplierId     | 供应商Id                   |
  | orderTime      | 下单时间                    |
  | buyer          | 采购员                     |
  | orderStatus    | 订单状态                    |
  | pickupWay      | 提货方式                    |
  | isDeclare      | 是否报关                    |
  | purDetails     | 采购单详情（Array[Json,Json]） |


purDetails：
| purDetailsKey | purDetailsDescription |
| ------------- | --------------------- |
| storeSku      | 库存SKU                 |
| unitPrice     | 单价                    |
| purQuantity   | 采购数量                  |
| totalPrice    | 总金额(含运费)              |
| conCovDate    | 合同约定交期                |
| delQuantity   | 交货数量                  |
| deliverDate   | 实际交期                  |
| logNumber     | 物流追踪单号                |
| remark        | 备注                    |
| salesman      | 业务员     Array[]       |
  返回：

  ```json
  Boolean
  ```


- 选择商品

  路由：/purchase/productList

  方法：GET

  参数：无

  返回：

  ```json
  [
    {
  	"storeSku":"编号",
  	"nameCN":"商品中文名"，
      "nameEN":"商品英文名"
    },
    {
      	...
    },
  ]
  ```


- 编辑采购单打开

  路由：/purchase/purchaseOne

  方法：GET

  参数：

  | Key         | Description |
  | ----------- | ----------- |
  | orderNumber | 订单号         |

  返回：

  ```json
  {
    {
    	"purchaseId":"订单id"
    	"orderNumber":"订单号",
  	"contractNumber":"合同号",
   	"supplier":{
        	  "supplierId":"供应商ID",
        	  "supplierName":"供应商名字"
      }
  	"orderTime":下单时间,
  	"buyer":"采购员",
  	"orderStatus": 订单状态,
  	"isDeclare": 是否报关,
  	"purDetails":[
    		{
  			"storeSkuId":"库存SKU ID",
  			"storeSku":"库存SKU",
    			"proNameCN":"商品中文名",
    			"proNameEN":"商品英文名",
    			"unitPrice":"单价",
    			"purQuantity":采购数量,
    			"totalPrice":"总金额(含运费)",
    			"conCovDate":合同约定交期,
    			"purQuantity":交货总数量，
    			"deliverDate":实际交期，
    			"salesman":[业务员],
    			"logNumber":"物流追踪单号"
    			"remarks": "备注"
  		},
  		{
    		    ...
    		}
  	],
  	"pickupWay":"提货方式",
  	"remarks":"详细备注"
    } 
  }
  ```




- 编辑采购单保存

  路由：/purchase/purUpdate

  方法：POST

  参数：

  | Key            | Description        |
  | -------------- | ------------------ |
  | purchaseId     | 订单ID               |
  | orderNumber    | 订单号                |
  | contractNumber | 合同号                |
  | supplierId     | 供应商ID              |
  | orderTime      | 下单时间               |
  | buyer          | 采购员                |
  | salesman       | 业务员                |
  | orderStatus    | 订单状态               |
  | pickupWay      | 提货方式               |
  | isDeclare      | 是否报关               |
  | purDetails     | 采购单详情  Array[Json] |

purDetails：
| purDetailsKey | purDetailsDescription |
| ------------- | --------------------- |
| storeSkuId    | 库存SKU ID              |
| storeSku      | 库存SKU                 |
| unitPrice     | 单价                    |
| purQuantity   | 采购数量                  |
| totalPrice    | 总金额(含运费)              |
| conCovDate    | 合同约定交期                |
| delQuantity   | 交货数量                  |
| deliverDate   | 实际交期                  |
| logNumber     | 物流追踪单号                |
| remark        | 备注                    |
| salesman      | 业务员         Array[]   |
  返回：

  ```json
  Boolean
  ```


- 订单详情

  路由：/purchase/detailList

  方法：GET

  参数：

  | Key         | Description |
  | ----------- | ----------- |
  | orderNumber | 订单号         |

  返回：

  ```json
  {
  	"orderNumber":"订单号",
  	"contractNumber":"合同号",
  	"supplierName":"供应商",
  	"orderTime":下单时间,
  	"buyer":"采购员",
  	"orderStatus": 订单状态,
    	"purTotalPrice": 订单总金额，
   	"isDeclare": 是否报关,
  	"purDetails":[
    		{
  				"storeSku":"库存SKU",
    				"proNameCN":"商品中文名",
    				"proNameEN":"商品英文名",
    				"unitPrice":"单价",
    				"purQuantity":采购数量,
    				"totalPrice":"总金额(含运费)",
    				"conCovDate":合同约定交期,
    				"deliverTotal":已交货数量,
    				"deliverDate":实际交期，
    				"salesman":[业务员],
    				"logNumber":"物流追踪单号"
    				"remarks": "备注"
  		},
  		{
    		    ...
    		}
  	],
  	"pickupWay":"提货方式",
  	"remarks":"详细备注"
  }
  ```



- 订单跟进打开
  路由：/purchase/statusList

  方法：GET

  参数：

  | Key         | Description |
  | ----------- | ----------- |
  | orderNumber | 订单号         |

  返回：

  ```json

    {
  	"orderStatus":"订单状态",
      "purDetails":[
        {
          		"deliverId":"库存SKU ID"
          		"storeSku":"库存SKU",
    				"proNameCN":"商品中文名",
    				"purQuantity":采购数量,
    				"deliverTotal":已交货数量,
    				"remarks": [备注]
        },
        {
    	      ...
    	  }
      ]
    },

  ```




- 订单跟进保存
  路由：/purchase/statusUpdate

  方法：POST

  参数：

  | Key         | Description               |
  | ----------- | ------------------------- |
  | orderNumber | 订单号                       |
  | orderStatus | 订单状态                      |
  | delivers    | 订单详情       Array[deliver] |


  deliver：
| deliverKey  | deliverDescription |
| ----------- | ------------------ |
| deliverId   | 库存SKU ID           |
| delQuantity | 交货数量               |
| deliverDate | 实际交期               |
| remark      | 备注                 |

  返回：

  ```json
  Boolean
  ```


- 添加备注打开

  路由：/purchase/findRemark

  方法：GET

  参数：

  | Key         | Description |
  | ----------- | ----------- |
  | orderNumber | 订单号         |

  返回：

  ```json
  [
    库存sku
  ]
  ```


- 添加备注保存

  路由：/purchase/addRemark

  方法：POST

  参数：

  | Key      | Description |
  | -------- | ----------- |
  | storeSku | 库存SKU       |
  | remark   | 订单状态        |

  返回：

  ```json

  ```


- 供应商列表
  路由：/supplier/supplierList
  方法：GET
  参数：无
  返回：
  ```json
  [
    		{
        	  "supplierId":"供应商ID",
        	  "supplierName":"供应商名字"，
            "contacts": 联系人,
    		  "telephone": 固定电话,
    		  "cellphone": 手机号码
        	},
          {
      	    ...
      	}
  ]

  ```


- 供应商添加
  路由：/supplier/supplierSave
  方法：POST
  参数：
  | Key       | Description |
  | --------- | ----------- |
  | name      | 供应商名字       |
  | contacts  | 联系人         |
  | telephone | 固定电话        |
  | cellphone | 手机号码        |
  返回：
  ```json
  Boolean
  ```


- 供应商编辑打开

  路由：/supplier/supplierOne

  方法：GET

  参数：

  | Key        | Description |
  | ---------- | ----------- |
  | supplierId | 供应商Id       |

  返回：

  ```json
  {
    "supplierId": 供应商Id,
    "supplierName": 供应商名字,
    "contacts": 联系人,
    "telephone": 固定电话,
    "cellphone": 手机号码
  }
  ```



- 供应商编辑

  路由：/supplier/supplierUpdate

  方法：POST

  参数：

  | Key        | Description |
  | ---------- | ----------- |
  | supplierId | 供应商Id       |
  | contacts   | 联系人         |
  | telephone  | 固定电话        |
  | cellphone  | 手机号码        |

  返回：

  ```json
  Boolean
  ```



- 采购统计单

  路由：/purchasePlan/purTotal

  方法：GET

  参数：

  | Key      | Description |
  | -------- | ----------- |
  | storeSku | 库存SKU       |
  | nameCN   | 商品中文名       |
  | supplier | 供应商         |
  | buyer    | 采购员         |

  返回：

  ```json
  {
    "buyer":采购员,
    "supplierName":供应商名字,
    "proNameCN":SKU中文名,
    "proStoreSku":库存SKU,
    "salesVolume":日销售量,
    "totalVolume":总销量,
    "orderProduct":订单库存（生产中）,
    "orderTransit":订单库存（到仓库途中）,
    "stock":仓库库存,
    "receiptStock":中国仓—FBA仓库,
    "FBAStore":FBA库存,
    "":当天退货个数,
    "":上架→目前退货统计,
    "":退货率
  }
  ```


- 创建/保存采购计划

  路由：/purchasePlan/submit

  方法：POST

  参数：

  | Key       | Data Type | Description |
  | --------- | --------- | ----------- |
  | status    | String    | 状态          |
  | applicant | String    | 申请人         |
  | details   | Array     | 采购明细数组      |

details
| Key                      | Data Type | Description |
| ------------------------ | --------- | ----------- |
| product_id               | String    | 产品id        |
| local_storage            | String    | 广州仓在途及库存数量  |
| fba_storage              | String    | FBA仓在途及库存总数 |
| average_7                | String    | 7天平均销量      |
| average_30               | String    | 30天平均销量     |
| expected_sales           | String    | 预计销量        |
| local_transport          | String    | 国内运输和验货时间   |
| abroad_transport         | String    | 国际运输和入仓时间   |
| prepare_period           | String    | 备货周期        |
| safety_stock             | String    | 安全库存天数      |
| purchase_amount          | String    | 执行采购数量      |
| supplier                 | String    | 供应商的id      |
| unit_cost                | String    | 单件采购成本      |
| estimate_production_days | String    | 预计生产时间      |
| least_amount             | String    | 最少起订量       |
| advance_pay_rate         | String    | 预付比例        |
| first_time               | String    | 是否首次采购      |
| remarks                  | String    | 备注          |

  返回：

  ```json
  无
  ```

- 采购计划首页展示

  路由：/purchasePlan/show

  方法：GET

  参数：

  | Key         | Data Type | Description                      |
  | ----------- | --------- | -------------------------------- |
  | plan_id     | String    | 采购计划编号                           |
  | applicant   | String    | 申请人                              |
  | stratTime   | String    | 申请开始时间                           |
  | endTime     | String    | 申请结束时间                           |
  | operator    | String    | 运营部审核人                           |
  | supplyChain | String    | 供应链审核人                           |
  | currentPage | Number    | 当前页数                             |
  | pageSize    | Number    | 每一页的数据量                          |
  | workbench   | Number    | 工作台：{1: 待处理, 2: 进行中, 3: 已通过} 默认1 |

  返回：

```json
{
  [
    {
        "plan_Id":"采购计划编号",
        "status":"状态",
        "peoples":{
          "applicant":"申请人",
          "operator":[],
          "suppliyChain":[]
        },
        "details":[
          {
            "productSku":"商品库存sku",
            "productName":"中文名",
            "log":"备注"
          },
          {...}
        ],
        "permissiong":{
          "view":"是否可以查看",
          "edit":"是否可以编辑",
          "review":"是否可以审核"
        }
    },
    {...}
  ],
  "pageCount":"页数",
  "add":"当前用户是否可以进行创建采购计划的操作"
}

```



- 采购计划编辑

  路由：/purchasePlan/editShow

  方法：GET

  参数：

  | Key     | Data Type | Description |
  | ------- | --------- | ----------- |
  | plan_id | String    | 采购计划编号      |


返回：

```json
{
    "status": "采购计划状态",
    "applicantName": "申请人",
    "details": [
        {
            "_id":"_id",
            "productSku": "产品Sku",
            "productName": "产品名字",
            "product_id": "产品ID",
            "local_storage": "广州仓在途及库存数量",
            "fba_storage": "FBA仓在途及库存总数",
            "average_7": "7天平均销量",
            "average_30": "30天平均销量",
            "expected_sales": "预计销量",
            "local_transport": "国内运输和验货时间",
            "abroad_transport": "国际运输和入仓时间",
            "prepare_period": "备货周期",
            "safety_stock": "安全库存天数",
            "purchase_amount": "执行采购数量",
            "supplier": "供应商的id",
            "unit_cost": "单件采购成本",
            "estimate_production_days": "预计生产时间",
            "least_amount": "最少起订量",
            "advance_pay_rate": "预付比例",
            "first_time": "是否首次采购",
            "remarks": "备注",
        },
        {...}
    ],
    //审核结果
    "reviews":
    [
      {
        "status":"审核结果(同意或不同意)", //0为不同意，1为同意
        "operator":"运营的审核意见（存在则是运营意见，不存在则为空）",
        "supplyChain":"供应链的审核意见（存在就是供应链意见，不存在则为空）",
        "log":"意见"
      },
      {...}
    ]
    
}
```


- 采购计划编辑

  路由：/purchasePlan/editSubmit

  方法：POST

  参数：

  | Key       | Data Type | Description |
  | --------- | --------- | ----------- |
  | status    | String    | 状态          |
  | applicant | String    | 申请人         |
  | plan_id   | String    | 采购计划编号      |
  | details   | Array     | 采购明细数组      |

details
| Key                      | Data Type | Description |
| ------------------------ | --------- | ----------- |
| product_id               | String    | 产品id        |
| local_storage            | String    | 广州仓在途及库存数量  |
| fba_storage              | String    | FBA仓在途及库存总数 |
| average_7                | String    | 7天平均销量      |
| average_30               | String    | 30天平均销量     |
| expected_sales           | String    | 预计销量        |
| local_transport          | String    | 国内运输和验货时间   |
| abroad_transport         | String    | 国际运输和入仓时间   |
| prepare_period           | String    | 备货周期        |
| safety_stock             | String    | 安全库存天数      |
| purchase_amount          | String    | 执行采购数量      |
| supplier                 | String    | 供应商的id      |
| unit_cost                | String    | 单件M采购成本     |
| estimate_production_days | String    | 预计生产时间      |
| least_amount             | String    | 最少起订量       |
| advance_pay_rate         | String    | 预付比例        |
| first_time               | String    | 是否首次采购      |
| remarks                  | String    | 备注          |


返回：

```json
无
```



- 采购计划审核

路由：/purchasePlan/review

方法：POST

参数：

| Key     | Data Type | Description |
| ------- | --------- | ----------- |
| status  | String    | 状态          |
| review  | object    | 审核数据        |
| total   | Number    | 总金额         |
| details | object    | 采购明细        |


review
| Key    | Data Type | Description |
| ------ | --------- | ----------- |
| agree  | Number    | 同意或不同意（1或0） |
| remark | String    | 审核意见        |


details
| Key                      | Data Type | Description |
| ------------------------ | --------- | ----------- |
| product_id               | String    | 产品id        |
| local_storage            | String    | 广州仓在途及库存数量  |
| fba_storage              | String    | FBA仓在途及库存总数 |
| average_7                | String    | 7天平均销量      |
| average_30               | String    | 30天平均销量     |
| expected_sales           | String    | 预计销量        |
| local_transport          | String    | 国内运输和验货时间   |
| abroad_transport         | String    | 国际运输和入仓时间   |
| prepare_period           | String    | 备货周期        |
| safety_stock             | String    | 安全库存天数      |
| purchase_amount          | String    | 执行采购数量      |
| supplier                 | String    | 供应商的id      |
| unit_cost                | String    | 单件M采购成本     |
| estimate_production_days | String    | 预计生产时间      |
| least_amount             | String    | 最少起订量       |
| advance_pay_rate         | String    | 预付比例        |
| first_time               | String    | 是否首次采购      |
| remarks                  | String    | 备注          |

返回：

```json
true
```


- 返回申请人或审核人

路由：/purchasePlan/getPeoples

方法：GET

参数：
无

返回：

```json
  applicant:
  [
    {
      "name":"名字",
      "_id":"_id",
    },
    {...}
  ],
  operator:
  [
    {
      "name":"名字",
      "_id":"_id",
    },
    {...}
  ],
  supplyChain:
  [
    {
      "name":"名字",
      "_id":"_id",
    },
    {...}
  ]
```



### [daily]每日运营

- 缺货损失

  路由：/daily/PopupList

  方法：GET

  参数：

  | Key    | Description |
  | ------ | ----------- |
  | time   | 搜索时间        |
  | teamID | 小组ID        |

  返回：

 ```json
 [
   {
     "asin":ASIN,
   	"sellerSku":MSKU,
   	"sellableStock":期间最新可售库存,
   	"receiptingStock":期间最新待收货库存,
   	"transportStock":期间最新转库中库存,
   	"name":商品名称,
   	"storeSku":库存SKU,
   	"teamName":小组名,
   	"projectedSales":预计日销量,
   	"state":状态,
   	"averageLoss":缺货损失额,
   	"lossVolume":近3日平均销量,
   	"shopName":店铺名,
   	"unitPrice":期间最新单价
   },
   {
       ...
   }
 ]
 ```


- 每日信息

  路由：/daily/list

  方法：GET

  参数：

  | Key       | Description |
  | --------- | ----------- |
  | timeRange | 搜索时间段       |

  返回：

  ```json
  [{
		"asin":ASIN,
		"name":商品名称,
		"projectedSales":预计日销量,
		"receiptingStock":期间最新待收货库存,
		"salesPrice":期间累计净销售额,
		"salesVolume":期间累计销量,
		"sellableStock":期间最新可售库存,
		"sellerSku":MSKU,
		"shop":{name: 店铺名, id: 店铺id},
		"state":状态,
		"storeSku":库存SKU,
		"teamName":小组名,
		"transportStock":期间最新转库中库存,
		"unitPrice":期间最新单价,
		"shelfTime":上架时间,
		"epitaph": 墓志铭
    }]
    ```

- `墓志铭选择 GET /daily/epitaph/opt`

	``` bash
	# 返回值
	[{ _id: 商品Id, asin:商品Asin, epitaph:墓志铭内容 }]
	```

- `墓志铭保存 POST /daily/epitaph`

	``` bash
	# 请求参数
	asin String 商品Asin 
	content String 墓志铭内容 
	```


- 每日报表

  路由：/daily/show

  方法：GET

  参数：

  | Key  | Description |
  | ---- | ----------- |
  | time | 搜索时间        |

  返回：

  ```json
  {
    barData:[
      {
      "date":"时间"
  	  "monthAllSales":"销量提示"
  	  "y":"y轴"
      },
      {
        ...
      }
    ],
    "date":"搜索时间",
    lineDateCount:{
      "小组名": "[60天前到月底的销量] "
      ...
    }
    lineDatePrice:{
    	"小组名":"[60天前到月底的销售额]" 
      ...
    }
    "nowMonthStart":"小组名在月头数据的下标"
    "result":{
    "averageCount":"30天日均销量"
  	"averageSales":"30天日均销售额"
  	"dailyCount":"当日销量"
  	"dailySales":"当日销售额"
  	"monthCount":"本月销量"
  	"monthSales":"本月销售额"
  	"relativelyYesMultiplicationCount":"销售量比上日+/-"
  	"relativelyYesMultiplicationPrice":"销售额比上日+/-"
  	"relativelyYesPercentCount":"销售量比上日%"
  	"relativelyYesPercentPrice":"销售额比上日%"
  	"stockLoss":"缺货损失"
  	"team"：{
      	"teamName":"小组"
      	"teamId":"小组ID"
      }
    }
  }
  ```

- `运营销售情况 GET /daily/sales`

	``` bash
	# 请求参数
	level String 运营级别
	team String 所属小组
	manager String 所属用户
	startTime String 开始时间
	endTime String 结束时间
	# 返回值
	[{ ranking: 排名, team:  小组, manager: 成员,  level:  级别, asin:  Asin, salesVolume: 销售额, totalSales: 销售总额, monthlySales: 月销量  }]
	```

### [me] 用户自身管理

- 修改密码

  路由：/me/password

  方法：PUT

  参数：

  | Key      | Data Type | Description          |
  | -------- | --------- | -------------------- |
  | password | String    | 使用CryptoJS.MD5加密后的密码 |

  返回：

  ```json
  {
    
  }
  ```​

### [teams]小组管理

- `小组列表 GET /team/list`

	``` bash
	# 返回值
	{
		// 品类选择
		categories: [{ _id, name }],
		// 用户选择
		selectUser： [{ _id, account, name, role }]
		// 级别选择
		selectLevel： [ ]
		// 小组
		result:[{ 
			_id,
			name, 
			avatar, 
			teamInfo: [{ _id, account, name, role, level }], 
			categories: [{ _id, name }], 
			createdAt, 
			updatedAt
		}]	
	}
	```

- `小组添加 POST /team/save`

	``` bash
	# 请求参数
	name String 小组名称 
	teamInfo Array 成员列表  [{ _id, level }]
	categories Array 品类列表 [ _id ]
	avatar Base64 团队图片
	 
	# 返回值
	{ success: true, result: result }
	```


- `小组更新 POST /team/update`

	``` bash
	# 请求参数
	id String 小组ID
	name String 小组名称 
	teamInfo Array 成员列表  [{ _id, level }]
	categories Array 品类列表 [ _id ]
	avatar Base64 团队图片
	 
	# 返回值
	{ success: true, result: result }
	```

- `小组移除 GET /team/remove`

	``` bash
	# 请求参数
	id String 小组ID 
	# 返回值
	{ success: true, result: result }
	```

### [roles]角色管理

- 角色列表：

  路由：/roles

  方法：GET

  参数：无

  返回：

  ```json
  [
  	{
        "_id":"角色ID",
        "name":"角色名",
        "type":"角色类型",
        "createdAt":"创建时间",
        "updatedAt":"更新时间",
        "history":[历史记录],
        "routes":[路由权限列表],
        "management":[下属角色id列表]
      },
  	{...}
  ]
  ```



- 创建角色：

  路由：/roles

  方法：POST

  参数：

  | Key        | Data Type | Description            |
  | ---------- | --------- | ---------------------- |
  | type       | String    | 角色类型，可以先在角色列表中初步筛选不能重复 |
  | name       | String    | 角色名                    |
  | routes     | Array     | 路由列表，可以为空              |
  | department | String    | 部门名字                   |
  | management | Array     | 下属角色id列表               |

  返回：

  ```json
  {
    "_id":"角色ID",
    "name":"角色名",
    "type":"角色类型",
    "createdAt":"创建时间",
    "updatedAt":"更新时间",
    "history":[历史记录],
    "routes":[路由权限列表],
    "management":[下属角色id列表]
  }
  ```



- 部门列表：

  路由：/roles/department

  方法：GET

  参数：无

  返回：

  ```json
  [
    "部门1",
    "..."
  ]
  ```

  ​
### [appraise]评论统计

- 角色列表：

  路由：/appraise/EVALTotal

  方法：GET

  参数：无

  返回：

  ```json
  [
    {
      "inTime":"数据时间"
  	"asin":"ASIN"
  	"imgUrl":"图片"
  	"title":"标题"
  	"price":"售价
  	"side":"站点"
  	"totalStar":评价星级
  	"reviewsCnt":评价数量
  	"vpCnt":VP数量
  	"vpProportion":"VP占比"
  	"nvpCnt":直评数量
  	"nvpProportion":"直评占比"
  	"reviewFirstTime":"第一次评价"
  	"reviewLastTime":"最近一次评价"
    },
    {...}
  ]
  ```



- 查看详情：

  路由：/appraise/EVALDetail

  方法：GET

  参数：

  | Key              | Data Type | Description |
  | ---------------- | --------- | ----------- |
  | asin             | String    | ASIN        |
  | side             | String    | 站点          |
  | verifiedPurchase | String    | 购买状态        |
  | startDate        | String    | 开始日期        |
  | endDate          | String    | 结束日期        |

  返回：

  ```json
  {
    "details": [
    	{
    	  "dataTime":"数据日期",
  		"reviewTime":"评价时间",
  		"asin":"asin",
  		"side":"站点",
  		"star":评价星级,
  		"authorId":"评价人ID",
  		"author":"评价人",
  		"verifiedPurchase":"是否VP",
  		"hasImg":"是否有图",
  		"hasVideo":"是否有视频",
  		"content":"评论内容",
  		"voteNum":点赞数
    	},
    	{...}
    ]
       "lineReview": {
       	"lineTime":["评论时间"(2017-10-10)],
       	"isPv":[有购买(4)],
       	"isNotPv":[非购买(2)]
      },
      "starDivide":{
      	five:"5星",
      	four:"4星",
      	three:"3星",
      	two:"2星",
      	one:"1星",
      }
  }
  ```



- review任务：

  路由：/appraise/EVALTask

  方法：GET

  参数：

  | Key  | Data Type | Description     |
  | ---- | --------- | --------------- |
  | asin | String    | ASIN            |
  | side | String    | 站点（SI_US，SI_**） |

  返回：

  ```json
  无
  ```


  

- 关键词：

  路由：/appraise/keyword

  方法：GET

  参数：

  | Key          | Data Type | Description |
  | ------------ | --------- | ----------- |
  | bprice       | String    | 最小价格        |
  | eprice       | String    | 最大价格        |
  | breview      | String    | 最小评论数       |
  | ereview      | String    | 最大评论数       |
  | bscore       | String    | 最小打分        |
  | escore       | String    | 最大打分        |
  | keyword      | String    | 关键字         |
  | currentPage  | Number    | 当前页数        |
  | itemsPerPage | Number    | 页面数据量       |
  | brate        | String    | 最小大类排名      |
  | erate        | String    | 最大大类排名      |


  返回：

  ```json
  {
  	"dataList   ": {
  	  "price":价格
  	  "csrReview"："用户评论数"
  	  "title:"标题"
  	  "smallType":"小类名"
  	  "score":"打分"
  	  "isZiYingv":"是否自营"
  	  "isFba":"是否FBA"
  	  "bigTypeRank":"大类排名"
  	  "bigType":"大类名"
  	  "url":"asin地址"
  	  "asin":"asin"
  	  "currency":"价格符号"
  	}
  	keywords:["关键字"]，     
    totalItems:总数据量
    taskSide:["站点"]
  }
  ```

- 关键词任务：

  路由：/appraise/EVALTask

  方法：POST

  参数：

  | Key     | Data Type | Description     |
  | ------- | --------- | --------------- |
  | keyword | String    | 关键词             |
  | site    | String    | 站点（SI_US，SI_**） |

  返回：

  ```json
  无
  ```


- 评论任务：

  路由：/appraise/setReviewDescTask

  方法：POST

  参数：

  | Key   | Data Type | Description     |
  | ----- | --------- | --------------- |
  | asin  | String    | ASIN            |
  | site  | String    | 站点（SI_US，SI_**） |
  | brand | String    | 品牌              |

  返回：

  ```json
  无
  ```




- 评论任务列表：

  路由：/appraise/reviewContent

  方法：GET

  参数：

  | Key         | Data Type | Description |
  | ----------- | --------- | ----------- |
  | taskId      | String    | 任务选择        |
  | classify    | String    | 类目选择        |
  | currentPage | Number    | 当前页码        |
  | pageSize    | Number    | 一页数据数量      |

  返回：

  ```json
  {
    content: [
      {
      taskID: "编号",
      asin: "ASIN",
      star: "评论星级",
      title: "评论标题",
      content: "评论内容"
    	},
      {...}
    ],
    task: ["任务选择"],
    pageTotal: "总数据量"
  }
  ```



- 评论任务站点列表：

  路由：/appraise/reviewSite

  方法：GET

  参数：无

  返回：

  ```json
  {
    site:[{
      name: "站点名称"，
      value: "站点值"
    }]
  }
  ```

### 

### [profit]毛利率统计报表

- sku详情：

  路由：/profit/profitDetail

  方法：POST

  参数：

  | Key      | Data Type | Description |
  | -------- | --------- | ----------- |
  | shopName | String    | 店铺名         |
  | teamName | String    | 小组名         |
  | storeSku | String    | sku         |

  返回：

  ```json
  {
    "asin":"asin",
    "nameCN":"商品中文名",
    "storeSku":"库存sku"
  }
  ```

### [base]基础信息管理

- 商品管理：

  路由：/base/list

  方法：GET

  参数：无

  返回：

  ```json
  {
    list:[
      {
    	  "id":"id",
    	  "sellerSku":"卖家sku",
    	  "productId":"产品id",
    	  "FBA":是否fba,
    	  "fnsku":"fnsku",
    	  "asin":"asin",
    	  "nameCN":"中文名",
    	  "shop":{
    	  "name":"店铺名",
    	  "shopId":"店铺ID"
    	},
    	  "teamName":"小组名",
    		"state":"状态",
    		"projectedSales":"预计日销量",
    		"price":"标准价格",
      	"shelfTime":"上架时间"
    	},
      {···}
      ],
    	stockList:[
        {
          _id: "id",
         store_sku: "库存sku",
         name_cn: "中文名"
        },
        {···}
      ],
    shopsNames:[
      {
        _id: "id", 
        name: "店铺名"
      }
    ]
  }
  ```


- 商品添加：

  路由：/base/saveMerchandise

  方法：POST

  参数：

  | Key            | Data Type | Description |
  | -------------- | --------- | ----------- |
  | asin           | String    | ASIN        |
  | projectedSales | Number    | 预计日销量       |
  | productId      | String    | 库存SKU       |
  | sellerSku      | String    | 卖家sku       |
  | shelfTime      | Date      | 上架时间        |
  | shopId         | String    | 所属店铺        |
  | teamId         | String    | 所属小组        |
  | state          | Number    | 商品销售状态      |
  | price          | Number    | 标准价格        |
  | FBA            | Number    | FBA         |
  | fnsku          | String    | FNSKU       |

  返回：

  ```json
  Boolean
  ```


- 商品编辑：

  路由：/base/update

  方法：POST

  参数：

  | Key            | Data Type | Description |
  | -------------- | --------- | ----------- |
  | asin           | String    | ASIN        |
  | projectedSales | Number    | 预计日销量       |
  | productId      | String    | 库存SKU       |
  | sellerSku      | String    | 卖家sku       |
  | shelfTime      | Date      | 上架时间        |
  | shopId         | String    | 所属店铺        |
  | teamId         | String    | 所属小组        |
  | state          | Number    | 商品销售状态      |
  | price          | Number    | 标准价格        |

  返回：

  ```json
  Boolean
  ```


- 商品删除：

  路由：/base/deleteMerd/:id

  方法：DELETE

  参数：

  | Key  | Data Type | Description |
  | ---- | --------- | ----------- |
  | id   | String    | 商品id        |

  返回：

  ```json
  Boolean
  ```


### [workOrder]客服工单

- 客服列表：

  路由：/workOrder/customerList

  方法：GET

  参数：无

  返回：

  ```json
  {
    customerList:[
      {
        operateTeam:[
          {
          	id:"运营小组id",
          	name:"运营小组名字"
        	},
      	{···}
        ],
    	  WOType:["工单类型"],
        customer:{
          id:"客服ID"
          name:"客服名字"
        }
    	},
      {···}
    ],
    team:[
      {id: "小组id", name:"小组名称"},
      {···}
    ]，
    customers：[
    	{id: "客服id", name:"客服名字"},
      {···}
    ]
  }
  ```


- 编辑客服：

  路由：/workOrder/updateCustomer

  方法：POST

  参数：

  | Key         | Data Type | Description                              |
  | ----------- | --------- | ---------------------------------------- |
  | combine     | Boolean   | 是否以工单类型进行筛选                              |
  | operateTeam | String    | 运营小组ID(dealMethod: 选项被修改{add（增加），delete（删除）}) |
  | WOType      | String    | 工单类型(dealMethod: 选项被修改{add（增加），delete（删除）}) |
  | customerID  | String    | 客服ID                                     |

  返回：

  ```json
  无
  ```


- 添加客服：

  路由：/workOrder/saveCustomer

  方法：POST

  参数：

  | Key         | Data Type | Description |
  | ----------- | --------- | ----------- |
  | operateTeam | String    | 运营小组ID      |
  | WOType      | String    | 工单类型        |
  | customerID  | String    | 客服ID        |

  返回：

  ```json
  无
  ```


- ~~删除客服：~~

  ~~路由：/workOrder/deleteCustomer~~

  ~~方法：POST~~

  ~~参数：~~

  | ~~Key~~          | ~~Data Type~~ | ~~Description~~ |
  | ---------------- | ------------- | --------------- |
  | ~~WOCustomerID~~ | ~~String~~    | ~~工单客服ID~~      |

  ~~返回：~~

  ```- 待处理工单处理：   路由：/workOrder/dealOrder   方法：POST   参数：     Key 	Data Type	Description     log 	String   	工单客服ID          to  	String   	转派人           返回：       无  - json
  无
  ```




- 创建工单打开：

  路由：/workOrder/orderReady

  方法：GET

  参数：无

  返回：

  ```json
  {
    team:[{
      id:"小组id",
      name:"小组名称"
    },
      {···}
         ]
  }
  ```

- 创建工单：

  路由：/workOrder/createOrder

  方法：POST

  参数：

  | Key         | Data Type | Description |
  | ----------- | --------- | ----------- |
  | operateTeam | String    | 小组ID        |
  | WOType      | Number    | 问题类型        |
  | content     | String    | 内容          |

  返回：

  ```json
  无
  ```


- 待处理工单列表：

  路由：/workOrder/newOrderList

  方法：GET

  参数：

  | Key         | Data Type | Description                              |
  | ----------- | --------- | ---------------------------------------- |
  | currentPage | Number    | 当前页码                                     |
  | WOType      | Number    | 问题类型( 1：评论异常( 1.1： 评论变少， 1.2：总评分低于预警值， 1.3：出现差评)， 2：发现跟单， 7 ASIN被篡改, 8 文案被修改， 0：普通工单) |
  | pageSize    | Number    | 一页数据数量                                   |
  | date        | Date      | 时间范围                                     |

  返回：

  ```json
  {
    list:[
      {
        id:"id",
        orderID:"工单编号",
        type:"类型",
        creator:"创建人",
        content:"工单内容",
        handler:"当前处理人"
      },
      {···}
    ],
    typeCount:{
      "0":其他,
      "1":评论异常数量,
      "2":发现跟卖数量,
      "3"：Lightning Deals数量， 
      "4":销售权限数量， 
      "5":品牌更改数量， 
      "6":店铺IP问题数量，
      "7":asin被篡改数量，
      "8":文案被篡改数量
    },
    customers:[
      {
        id:"id",
        name:"名字"
      },
      {···}
    ]
  }
  ```


- 待处理工单编辑打开：

  路由：/workOrder/openOrder

  方法：GET

  参数：

  | Key  | Data Type | Description |
  | ---- | --------- | ----------- |
  | id   | String    | 工单客服ID      |

  返回：

  ```json
  {
    order:{
      creator:"创建人",
  	type:"类型",
  	createdAt:"创建时间",
  	content:"内容",
  	operateTeam:"小组",
      logs:[{name:"处理人",log:"处理意见"}],
      history:[{dealtAt:"处理时间",handler:"处理人"}]
    }
  }
  ```



- 待处理工单处理：

  路由：/workOrder/dealOrder

  方法：POST

  参数：

  | Key       | Data Type | Description    |
  | --------- | --------- | -------------- |
  | log       | String    | 处理意见           |
  | state     | Number    | 状态（1-已跟进 2-完结） |
  | id        | String    | 工单ID           |
  | handlerID | String    | 转派人或处理完结人      |

  返回：

  ```json
  无
  ```




- 已处理工单：

  路由：/workOrder/dealtList

  方法：GET

  参数：

  | Key          | Data Type | Description |
  | ------------ | --------- | ----------- |
  | startDate    | Date      | 开始时间        |
  | endDate      | Date      | 结束时间        |
  | state        | Number    | 状态          |
  | type         | Number    | 类型          |
  | currentPage  | Number    | 当前页码        |
  | itemsPerPage | Number    | 页面数据数量      |
  | creator      | String    | 创建人         |
  | handler      | String    | 当前处理人       |
  | treated      | String    | 参与处理人       |

  返回：

  ```json
  {
    list:[
      {
        ID: "id"
        orderID:"工单编号",
    	  state:"状态",
    	  type:"类型",
    	  creator:"创建人",
    	  content:"工单内容",
    	  handler:"当前处理人"
      },
      {···}
    ]，
    totalItems :数据总数
  }
  ```

### [WorkOrder] 工单系统

- `工单类型选项 GET /workOrder/orderTypes`

- `工单类型列表 GET /workOrder/orderType`

- `工单类型保存 POST /workOrder/orderType`

	``` bash
	# 请求参数
	_id ObjectId 主键（更新时需要）
	name String 名称
	tips String 说明
	remark String 备注
	isAsin Boolean 是否填写ASIN
	```

- `工单分配列表 GET /workOrder/orderAllot`

- `工单分配保存 POST /workOrder/orderAllot`

	``` bash
	# 请求参数
	_id ObjectId 主键（更新时需要）
	goods ObjectId 商品集合_id
	type ObjectId 工单类型_id
	customer ObjectId 客服人员_id
	```

- `工单分配删除 DELETE /workOrder/orderAllot/:id`

	``` bash
	# 请求参数
	id ObjectId 主键
	```

- `工单商品列表 GET /workOrder/orderGoods`

- `工单商品保存 POST /workOrder/orderGoods`

	``` bash
	# 请求参数
	_id ObjectId 主键（更新时需要）
	name String 名称
	remark String 备注
	merchandise ObjectId 商品集合[_id]
	```

- `工单商品删除 DELETE /workOrder/orderGoods/:id`

	``` bash
	# 请求参数
	id ObjectId 主键
	```​

###  [samples]样品管理

- 采购样品单列表：

  路由：/sample/order

  方法：GET

  参数：

  | Key         | Data Type | Description |
  | ----------- | --------- | ----------- |
  | applicantId | String    | 申请人ID       |
  | name        | String    | 样品名称        |
  | startTime   | Date      | 申请开始时间      |
  | endTime     | Date      | 申请结束时间      |
  | status      | Number    | 样品状态        |
  | curPage     | Number    | 当前页码        |
  | pageSize    | Number    | 页面数据数量      |

  返回：

  ```json
  {
    list:[
      {
        purId:"样品单ID",
        purNum:"编号",
        purCreDate:"采购单创建日期"
        purStatus:"状态",
        purPicture:"图片",
        splName:"样品名称",
        supplier:"供应商",
        splModel:"型号",
        splSpec:"规格",
        splColor:"颜色",
        splLink:"链接",
        purAmt:"采购数量",
        signAmt:"签收数量",
        splPrice:"单价",
        freight:"运费",
        applicant:"申请人"
      },
      {···}
    ],
    applicants: [
      {
        applId: "申请人ID",
        applName: "申请人名字"
      },
      {···}
    ]
  }
  ```


### 

- 创建样品单页面打开：

  路由：/sample/order/openNew

  方法：GET

  参数：无

  返回：

  ```json
  {
    supplier:[
      {
        supplierId: "供应商ID",
        supplierName: "供应商名称"
      },
      {···}
    ],
    sample: [
      {
        splId: "样品ID",
        splName: "样品名称"
      },
      {···}
    ]
  }
  ```

  ​

- 创建样品单：

  路由：/sample/order

  方法：POST

  参数：

  | Key        | Data Type | Description |
  | ---------- | --------- | ----------- |
  | applId     | String    | 申请人ID       |
  | mode       | Number    | 采购类型        |
  | type       | Number    | 采购方式        |
  | splId      | String    | 样品ID        |
  | supplierId | String    | 供应商ID       |
  | status     | Number    | 状态          |
  | purAmt     | Number    | 采购数量        |
  | price      | Number    | 单价          |
  | freight    | Number    | 运费          |

  返回：

  ```json
  无
  ```

  ​

- 样品单编辑/关联/签收：

  路由：/sample/order/:purId

  方法：PUT

  参数：

  | Key        | Data Type | Description |
  | ---------- | --------- | ----------- |
  | applId     | String    | 申请人ID       |
  | mode       | Number    | 采购类型        |
  | type       | Number    | 采购方式        |
  | supplierId | String    | 供应商ID       |
  | splId      | String    | 样品ID        |
  | purAmt     | Number    | 采购数量        |
  | price      | Number    | 单价          |
  | freight    | Number    | 运费          |
  | status     | Number    | 状态          |
  | extNum     | String    | 外部单号        |
  | signAmt    | Number    | 签收数量        |

  返回：

  ```json
  无
  ```

  ​

- 样品申请列表：

  路由：/sample/borrow

  方法：GET

  参数：

  | Key       | Data Type | Description                 |
  | --------- | --------- | --------------------------- |
  | splName   | String    | 样品名称                        |
  | startTime | Date      | 申请时间开始                      |
  | endTime   | Date      | 申请时间结束                      |
  | splType   | Number    | 样品状态(1、未借出，2、部分借出，3、全部借出)   |
  | option    | Number    | 查看( 1、全部，2、仅查看可借出，3、仅查看我借出) |
  | curPage   | Number    | 当前页码                        |
  | pageSize  | Number    | 页面数据数量                      |

  返回：

  ```json
  {
    list:{
      splPurId:"样品采购单Id"
      splNum:"编号",
      picture:"图片",
      name:"样品名称",
      supplier:"供应商",
      model:"型号",
      spec:"规格",
      color:"颜色",
      unit:"单位",
      price:"单价",
      total:"库存数量",
      borrow:"已借出数量"
    },
    {···}
  }
  ```

  ​

- 样品申请借出：

  路由：/sample/borrow

  方法：POST

  参数：

  | Key      | Data Type | Description |
  | -------- | --------- | ----------- |
  | splPurId | String    | 样品采购单Id     |
  | applyAmt | Number    | 申请样品数       |
  | fcstRtnT | Number    | 预计归还时间      |

  返回：

  ```json
  无
  ```

  ### 

- 样品已申请借出列表：

  路由：/sample/borrow/borrowed

  方法：GET

  参数：

  返回：

  ```json
  {
    list:{
      borrowId:"申请借出ID",
      splNum:"编号",
      status:"状态",
      picture:"图片",
      name:"样品名称",
      supplier"供应商",
      model:"型号",
      spec:"规格",
      color:"颜色",
      unit:"单位",
      price:"单价",
      applyAmt:"申请借出数量"
    },
    {···}
  }
  ```

  ###  

- 样品申请借出取消：

  路由：/sample/borrow/borrowed/:borrowId

  方法：PUT

  参数：无

  返回：

  ```json
  无
  ```

  ###  

- 样品列表借还管理：

  路由：/sample/borrow/manager

  方法：GET

  参数：

  | Key    | Data Type | Description |
  | ------ | --------- | ----------- |
  | splNum | String    | 样品编号        |

  返回：

  ```json
  {
    list:{
      splMgrId:"样品借出申请Id"
      splNum:"编号",
      status:"状态",
      picture:"图片",
      name:"样品名称",
      supplier"供应商",
      model:"型号",
      spec:"规格",
      color:"颜色",
      unit:"单位",
      price:"单价",
      total:"库存数量",
      borrow:"已借出数量"
    },
    {···}
  }
  ```

  ###  

- 样品列表确认借出：

  路由：/sample/borrow/manager

  方法：PUT

  参数：

  | Key       | Data Type | Description |
  | --------- | --------- | ----------- |
  | splNum    | String    | 样品编号        |
  | borrowAmt | String    | 借出样品数       |

  返回：

  ```json
  无
  ```

  ### 

- 样品列表确认归还：

  路由：/sample/borrow/manager

  方法：PUT

  参数：

  | Key       | Data Type | Description |
  | --------- | --------- | ----------- |
  | splNum    | String    | 样品编号        |
  | returnAmt | String    | 归还数量        |

  返回：

  ```json
  无
  ```

  ### 

- 创建样品：

  路由：/sample

  方法：POST

  参数：

  | Key  | Data Type | Description |
  | ---- | --------- | ----------- |
  | name | String    | 样品编号        |

  返回：

  ```json
  无
  ```

### [categorys]品类管理 

- `品类列表 GET /category/list`

- `品类添加 POST /category/save`

	``` bash
	# 请求参数
	name String 品类名称  必填
	shortName String 品类简称  必填
	chineseName String 品类中文  选填
	```

- `品类更新 POST /category/update`

	``` bash
	# 请求参数
	id String 品类ID 必填
	name String 品类名称  必填
	shortName String 品类简称  必填
	chineseName String 品类中文  选填
	```

- `品类移除 GET /category/remove`

	``` bash
	# 请求参数
	id String 品类ID 
	```

### [product]产品SKU 

- `产品信息 GET /product/info`

	``` bash
	# 请求参数
	store_sku String 产品sku 必填 
	```

- `产品列表 GET /product/list`

	``` bash
	# 请求参数
	name String 产品英文名 模糊匹配
	name_cn String 产品中文名 模糊匹配
	categories String 产品品类
	# 返回值
	{ categories: [ _id, name ], result: [{_id, name, name_cn, store_sku, categories, combination, createdAt, deleted}] }
	```

- `产品添加 POST /product/save`

	``` bash
	# 请求参数
	name String 产品英文名 必填 
	name_cn String 产品中文名 必填
	name_brief String 产品简称 必填
	categories String 产品品类ID 必填 
	categorieBrief String 产品品类简称  必填 
	combination:  [{ count: 数量, store_sku: 产品id }] 产品组合信息 
	```

- `产品更新 POST /product/update`

	``` bash
	# 请求参数
	store_sku String 产品sku 必填
	name String 产品英文名 
	name_cn String 产品中文名
	combination:  [{ count: 数量, store_sku: 产品id }] 产品组合信息 
	```

- `产品移除 GET /product/remove`

	``` bash
	# 请求参数
	store_sku String 产品sku 必填 
	```

### [UpdateLog]更新日志

- `最新版本号 GET /system/version`

- `推送日志内容 GET /system/pushlog`

- `更新日志列表 GET /system/updatelog`

	``` bash
	# 请求参数
	limit String 列表数量
	```

- `添加日志内容 POST /system/addlog`

	``` bash
	# 请求参数
	version String 版本号
	content String 日志内容
	```

- `编辑日志内容 POST /system/editlog`

	``` bash
	# 请求参数
	_id String 日志id
	version String 版本号
	content String 日志内容
	```

### [StoresHouses] 库存仓库

- `仓库列表 GET /stores/houses`


- `仓库保存 POST /stores/ihouse`

	``` bash
	# 请求参数
	name String 仓库名称
	```

- `仓库更新 POST /stores/uhouse`

	``` bash
	# 请求参数
	_id ObjectId 仓库id
	name String 仓库名称
	```

### [StoresJournal] 出入库管理

- `出入库列表 GET /stores/list`

	``` bash
	# 返回值
	{ houseSelect: 仓库选项, productList：库存列表 }
	```

- `出入库日志 GET /stores/journal`

	``` bash
	# 请求参数
	id String 产品id
	house String 仓库_id
	startTime String 开始时间
	endTime String 结束时间
	```

- `出入库登记 POST /stores/register`

	``` bash
	# 请求参数
	id String 产品id
	unit String 单位
	time String 出入库日期
	house String 仓库_id
	stock String 当前库存
	enter String 入库数量
	output String 出库数量
	note String 备注信息
	```

### [StoresJournal] 库存管理

- `库存列表 GET /base/product`

	``` bash
	# 请求参数
	house String 仓库_id
	# 返回值
	{ authority: 权限控制, houseSelect: 仓库选项, productList：库存列表 }
	```

- `出入库日志 GET /stores/journal`

	``` bash
	# 请求参数
	id String 产品id
	house String 仓库_id
	startTime String 开始时间
	endTime String 结束时间
	```


