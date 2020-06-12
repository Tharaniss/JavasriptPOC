let dataFilter = {
    type: "DataCenter",
    filter: function(data) {
        return data.filter((childItem)=>{
            return childItem.type === "Server"
        }
        );
    },
    children: {
        type: "Server",
        filter: function(data) {
            return data.filter((childItem)=>{
                return childItem.type === "Group" && childItem.name === "Gateway"
            }
            );
        },
        children: {
            type: "Group",
            filter: function(data) {
                return data.filter((childItem)=>{
                    return childItem.type === "Instance"
                }
                );
            },
            children: {
                type: "Instance",
                filter: function(data) {
                    return data.filter((childItem)=>{
                        return childItem.type === "Proxy"
                    }
                    );
                }
            }
        }
    }
}
let jsonObj = [{
    name: "scottdev",
    type: "DataCenter",
    children: [{
        name: "[hgwvld001]",
        type: "Server",
        children: [{
            name: "Gateway",
            type: "Group",
            children: [{
                name: "HGW-DA01",
                type: "Instance",
                children: [{
                    name: "local_mock",
                    type: "Proxy",

                }, {
                    name: "aws_printproxy",
                    type: "Proxy",

                }, {
                    name: "websocket_test",
                    type: "Proxy",

                }, ],

            }, {
                name: "HGW-DA02",
                type: "Instance1",
                children: [{
                    name: "local_mock",
                    type: "Proxy",

                }, {
                    name: "aws_printproxy",
                    type: "Proxy",

                }, ],

            }, ],

        }, {
            name: "Mock",
            type: "Group",
            children: [{
                name: "mock1",
                type: "Instance",

            }, {
                name: "mock2",
                type: "Instance",

            }, {
                name: "mock3",
                type: "Instance",

            }, {
                name: "mock4",
                type: "Instance",

            }, ],

        }, ],

    }, {
        name: "redisdevelopment",
        type: "redis",
        children: [{
            name: "abccluster",
            type: "cluster",
            children: [{
                name: "master-01",
                type: "master",

            }, {
                name: "replica-01",
                type: "replica",

            }, {
                name: "replica-02",
                type: "replica",

            }]

        }]

    }]

}]

function loop(jsonObj, newObj, filters) {
    Object.entries(jsonObj).forEach(([key,value])=>{
        newObj[key] = value;
        console.log(key, value);
        if (key && key == "children") {
            //console.log(value);
            newObj[key] = loop(value, [], filters);
            console.log(newObj[key]);
            newObj[key].forEach(function(item, index) {
                item.parent = newObj["name"];
            });
        }
        if (value.children && Array.isArray(value.children)) {
            let data = filters && typeof filters.filter === "function" && filters.filter(value.children);
            if (data && data.length) {
                newObj[key].children = data;
                newObj[key].children = loop(newObj[key].children, [], filters.children);
                newObj[key].children.forEach(function(item, index) {
                    item.parent = newObj[key]["name"];
                });
            } else {
                newObj[key].children = [newObj[key].children];
                //newObj[key].children = loop(value.children, [], filters);
            }
        }
    }
    );
    return newObj;
}
var newObj = {};
loop(jsonObj, newObj, dataFilter);
console.log(newObj)
