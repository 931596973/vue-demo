/* jshint esversion: 6 */

import _ from 'lodash';

export default {

//----------------------------- 左侧树处理 -----------------------------
    /**
     * 初始化左侧树数据
     * @param {String}} rootId 指定左侧树跟节点，可不指定，
     * @param {String} rootType 左侧树跟节点的数据类型，可不指定
     * 
     * @returns Promise 将查询出的数据转成树节点后返回
     */
    initTree(rootId, rootType) {
        let id = rootId ? rootId : SEDU.Util.getCurrentStaff().department.orgId;
        return new Promise((resolve, reject) => {
            this.loadDeptsByOrgId(id, (val) => {
                resolve(val);
            });
        });
        
    },
    loadDeptsByOrgId(rootId, callback) {
        if (!rootId) {
            callback([]);
        }
        let url = "/basis/depts/org/enable?orgId=" + rootId + "&&level=0";
        SEDU.Util.invokeServer({
            path: url,
            contentType: "application/json",
            type: "GET"
        }).then((data)=>{
            let nodes = this.departments2TreeNode(data);
            callback(nodes);
        }).catch((err) => {
            console.error("根据指定组织机构查询部门信息异常：" + JSON.stringify(err));
            callback([]);
        });
    },
    /**
     * 加载要展开节点的下级节点
     * @param {Object} item 要展开的节点对象
     */
    loadTreeChildrenNode(item) {
        let url = "/basis/depts/children?id=" + item.id + "&enable=true";
        return SEDU.Util.invokeServer({
            path: url,
            contentType: "application/json",
            type: "GET"
        }).then((data) => {
            let nodes = this.departments2TreeNode(data);
            return nodes;
        });
    },
    /**
     * 将部门转成树节点的形式，会保留原始的部门对象信息。ps:部门的原始对象是深拷贝得来的
     * @param {Array} depts 部门对象数组
     */
    departments2TreeNode(depts) {
        let nodes = [];
        depts.map((value) => {
            nodes.push(this.department2TreeNode(value));
        });
        return nodes;
    },
    // 部门信息转成树节点
    department2TreeNode(dept) {
        let node = {
            id: dept.id,
            code: dept.code,
            title: dept.name,
            name: dept.name,
            parentId: dept.parentId,
            orgId: dept.orgId,
            level: parseInt(dept.level),
            ordinal: parseInt(dept.ordinal),
            enable: dept.enable,
            paths: dept.paths,
            description: dept.description,
            expand: false,
            selected: false,
            principal: null,
            observer: [],
            children: [],
            type: 'dept',
            loading:false,
            _original: SEDU.Util.deepCopy(dept)
        };
        return node;
    },
    /**
     * 判断树的节点是否可被选择
     * @param {Object} node 树节点对象
     */
    treeNodeCanSelect(node) {
        return true;
    },
    /**
     * 获取树节点的图标名称
     * @param {Object}} node 树节点
     */
    getTreeNodeIcon(node) {
        return "";
    },
//----------------------------- table 内容处理 -----------------------------
    /**
     * 数据回显接口，根据用户id获取staff信息
     * @param {Array} ids 用户id
     * @returns 返回staff数组，如果没有数据则返回空数组
     */
    initBySelectionIds(ids) {
        // return SEDU.Util.invokeServer({
        //     path: "/staff-manage/query/userIds",
        //     contentType: "application/json",
        //     data: JSON.stringify(ids),
        //     type: "POST"
        // });
        return SEDU.API.user.getStaffByIds(ids);
    },
    /**
     * 根据当前组织机构树种选中节点查询人员信息
     * @param {Object} treeNode 当前选中的树的节点对象
     * @param {Object} param 查询参数对象
     *      {
     *       pageSize: 当前页数据条数
     *       pageNo: 当前页码，从1开始
     *       searchInfo: 模糊搜索条件，这里是用户title字段
     *      }
     */
    queryTableDataByTreeNode(treeNode, queryParam) {
        return this.getStaffByDeptId(treeNode.id, queryParam);
    },
    // 分页查询: 获取指定部门下的人员信息，入参说明见方法：getStaffByTreeNode
    getStaffByDeptId(deptId, queryParam) {
        let content = {
            departmentId: deptId,
            pageNo: queryParam.pageNo,
            pageSize: queryParam.pageSize,
            fuzzySearch: queryParam.fuzzySearch
        };
        return SEDU.Util.invokeServer({
            path: "/staff-manage/list/deptAndChildren",
            contentType: "application/json",
            data: JSON.stringify(content),
            type: "POST"
        });
    },
    /**
     * 人员信息转换成表格所需的格式
     * @param {Array} staffs 人员信息
     */
    tableDataFormat(staffs) {
        let _selectionData = [];

        staffs.map((staff) => {
            let row = {};
            row._id = staff.id;
            row.id = staff.id;
            row.name = staff.user.username;
            row.title = staff.user.title;
            row.dept = staff.department.name;
            row.deptId = staff.department.id;
            row.deptPaths = staff.department.paths;
            row.deptTitlePath = staff.deptTitlePath;
            row.orgId = staff.department.orgId;
            row._originel = staff;
            _selectionData.push(row);
        });
        return _selectionData;
    },

    /**
     * 将内部节点对象转换为对外输出的格式
     * @param {Object} item 要转换格式的单个节点对象
     */
    selection2OutObj(item) {
        let select = {};
        select.id = item.id;
        select.title = item.title;
        select.name = item.name;
        select.deptId = item.deptId;
        select.dept = item.dept;
        select.sex = item._originel ? item._originel.sex : "";
        select.birthday = item._originel ? item._originel.birthday : "";
        select.telephone = item._originel ? item._originel.telephone : "";
        return select;
    },
    /**
     * 设置已选中数据的显示信息
     * @param {Object} item 待处理已选择数据对象
     * @param {Number} index 当前已选数据在所有已选中的索引
     * @param {Array} data 所有已选数据集合
     */
    selectedShowTitle(item, index, data) {
        return item.title + "(" + item.name + ")";
    }
};