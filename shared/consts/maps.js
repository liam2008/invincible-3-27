(function (root) {
    root.PRODUCT_STATE = {
        0: "停售",
        1: "未开售",
        2: "推广期",
        3: "在售期",
        4: "清仓期",
        5: "归档",
        6: "备用"
    };

    root.PURCHASE_PLAN_STATUSES = {
        100: "待编辑",
        101: "已退回",
        200: "类目主管审核",
        210: "运营经理审核",
        220: "运营总监审核",
        230: "CEO审核【运营】",
        300: "供应链主管审核",
        310: "供应链总监",
        320: "CEO审核【采购】",
        400: "审核通过"
    };

    //路由权限映射
    root.ROUTE_MAP = {
        "a9ad8c5d99a54952a1ac34d6ee2bbcb3": {
            app_route: "main.authority.rolesManage",
            server_route: ['/roles', '/roles/department']
        },
        "24674d03a6a243ef97190079d88b1cb0": {
            app_route: "main.authority.userManage",
            server_route: ['/users', '/teams', '/roles']
        },
        "48558fee2c0f4d2d851899feecddf9af": {
            app_route: "main.authority.teamsManage",
            server_route: ["/teams"]
        },
        "481ca86831844004804b72fe59a90a7b": {
            app_route: "main.authority.creatVersionsLog",
            server_route: ["/logs"]
        },
        "910e2251d5a74c6ca6ccb2f86d55cf1c": {
            app_route: "main.base.categoryManage",
            server_route: ['/base/category']
        },
        "f0edb847bc264cfb89f8e2a1b8b4e387": {
            app_route: "main.base.goodsManage",
            server_route: ['/base/list', '/teams']
        },
        "b089f6c5c55d42618f3c626579034080": {
            app_route: "main.base.shopManage",
            server_route: ['/base/shops']
        },
        "32d7bafa5f484531a3b6a0b4f8ec8dd4": {
            app_route: "main.base.stockManage",
            server_route: ['/base/product']
        },
        "bf3c3260784942eb9bb0cee86019d44a": {
            app_route: "main.base.storeLog",
            server_route: ['/stores/list']
        },
        "03d746f1544b479c9eaf4583cc5cca12": {
        	app_route: "main.base.commodityManagement",
            server_route: ['/base/commodityManagement']
        },
        "579b0c08feec4492a02282076bd8f8eb": {
        	app_route: "main.base.storeManagement",
            server_route: ['/base/storeManagement']
        },
        "f59c01069ca64cd1ad85302b23a4b9a6": {
        	app_route: "main.base.storeSummary",
            server_route: ['/base/storeSummary']
        },
        "bba9d842ba1443a9ba94ce056876dd62": {
            app_route: "main.daily.import",
            server_route: ['/daily/import']
        },
        "322604f48cae46db990ce5ddfb3daebf": {
            app_route: "main.daily.list",
            server_route: ['/daily/list']
        },
        "f9ab7eb705b94b389c5a8a2ebc253645": {
            app_route: "main.daily.report",
            server_route: ["/daily/show"]
        },
        "dbc0f8ec81724bf28e173c9e29b177a5": {
            app_route: "main.daily.operationSale",
            server_route: ['/daily/operationSale']
        },
        "a92ef3d366a84885b35d9bc4f174c096": {
            app_route: "main.count.counter",
            server_route: ['/count/counted']
        },
        "82dd2c187d034b8e958d644a9f2216ed": {
            app_route: "main.count.formula",
            server_route: ['/count/listFormula']
        },
        "c50d6e50f4704a30a75b2e0b94d5e5f9": {
            app_route: "main.rank.sellerRank",
            server_route: ['/sellerRank/rankList']
        },
        "35f4c8b11a034d0e8e0380d987027551": {
            app_route: "main.purchase.program",
            server_route: ['/purchase/program']
        },
        "2821679a8b784aee812258ba3f88ab0d": {
            app_route: "main.purchase.summary",
            server_route: ['/purchase/purList']
        },
        "6b43b2b1a50c411d89bd9551e9b40fa4": {
            app_route: "main.purchase.statistics",
            server_route: ['/purchase/purTotal']
        },
        "bbafb9e0628e4aa5bfd0ffb2b84dc10f": {
            app_route: "main.purchase.supplier",
            server_route: ['/supplier/supplierList']
        },
        // "ea319b6d63eb41a4ab36668c5a6db082": {
        //     app_route: "main.margin.group",
        //     server_route: ['/profit/teamProfitShow']
        // },
        // "11e09c47cbbf4fa4b3ff156970fe8c70": {
        //     app_route: "main.margin.gross",
        //     server_route: ['/profit/profitShow']
        // },
        "3d2a114512644e3d82bbc552dec865c9": {
            app_route: "main.files.views",
            server_route: ['/files/fileManager']
        },
        "fbaf80cd5c964bac9bb0ae33a58b1781": {
            app_route: "main.files.manage",
            server_route: ['/files/fileManager']
        },
        "d592ea43e5484661885d1f37ffca8bfa": {
            app_route: "main.analysis.task",
            server_route: ['/appraise/task']
        },
        "abd72f4e0ca649f3aad54e838f27243d": {
            app_route: "main.analysis.review",
            server_route: ['/appraise/EVALTask']
        },
        "cb398c7d38da415f8a6af3044fbee6ce": {
            app_route: "main.analysis.keyword",
            server_route: ['/appraise/keyword']
        },
        "647a9be3562347af9b666f6a16a6ccf9": {
            app_route: "main.workOrder.clickTask",
            server_route: ['/workOrder/clickTask']
        },
        "a0cca57f9a4047e59ebe92dee2818c09": {
            app_route: "main.workOrder.productGather",
            server_route: ['/workOrder/productGather']
        },
        "6ee591ba2bcc48a193cf07361aaecfc8": {
            app_route: "main.workOrder.woRlues",
            server_route: ['/workOrder/woRlues']
        },
        "fafd3ebc00364d81843022404f94f4f9": {
            app_route: "main.workOrder.accountingClassManage",
            server_route: ['/workOrder/accountingClassManage']
        },
        "53c910cd5b664ef180797bdc158e9106": {
            app_route: "main.workOrder.notice",
            server_route: ['/workOrder/notice']
        },
        "5645127ef89f42d9b900d0411b256482": {
            app_route: "main.workOrder.createOrder",
            server_route: ['/workOrder/createOrder']
        },
        "1621f31d43e94c3bb7b96d3f13b78061": {
            app_route: "main.workOrder.dealingOrder",
            server_route: ['/workOrder/dealingOrder']
        },
        "d79a1d069fbf4382a04de3490161d260": {
            app_route: "main.workOrder.dealedOrder",
            server_route: ['/workOrder/dealedOrder']
        },
        "25cb84cf867a4beb97449d1bde6d9ca0": {
            app_route: "main.workOrder.finishOrder",
            server_route: ['/workOrder/finishOrder']
        },
        "d1429d70541445a9ae5102e2a3f28c42": {
            app_route: "main.workOrder.customerList",
            server_route: ['/workOrder/customerList']
        }
    };

    //站点对应的国家名字，应用于取国旗
    root.SIDE_CONTURY = {
        'US': 'United-States',
        "CA": "Canada",
        "DE": "Germany",
        "ES": "Spain",
        "FR": "France",
        "IN": "India",
        "IT": "Italy",
        "UK": "United-Kingdom",
        "JP": "Japan",
        "CN": "China"
    };

    //国家对应的addr
    root.SIDE_ADDR = {
        'US': 'com',
        "CA": "ca",
        "DE": "de",
        "ES": "es",
        "FR": "fr",
        "IN": "in",
        "IT": "it",
        "UK": "co.uk",
        "JP": "jp",
        "CN": "cn"
    };
}(Smartdo));