/*jshint esversion: 6 */
import axios from "axios";
import { message } from "antd";
import conf from "../conf";
import { staticMethod } from "../common/webAuth";

let i18n = {
    common: {
        "selectPlaceHolder":"请选择",
        "all": "全部",
        "userCenterConsole": "用户中心控制台",
        "logout": "退出登录",
        "previous": "上一步",
        "next": "下一步",
        "createAnother": "继续添加",
        "totalNum": "共__count__条记录",
        "minLength": "至少输入__count__个字符",
        "maxLength": "最多输入__count__个字符",
        "lengthRange": "请输入__min__-__max__个字符",
        "numberRange": "请输入__min__-__max__之间的数字",
        "lengthCount": "请输入__count__个字符",
        "desc": "描述",
        "complete": "完成",
        "baseInfo": "基本设置",
        "baseParam": "基本属性",
        "baseContent": "基本内容",
        "loginActivity": "最近登录",
        "pwdExpiryWarning": "密码过期",
        "sendWelcomeEmail": "发送欢迎邮件",
        "expired": "过期",
        "expiring": "将过期",
        "view": "查看",
        "edit": "编辑",
        "delete": "删除",
        "search": "查找",
        "action": "操作",
        "bindRoleWithUser": "分配角色",
        "save": "保存",
        "cancel": "取消",
        "close": "关闭",
        "importFile": "文件导入",
        "importAll": "全部导入",
        "manuallyAdd": "手动添加",
        "upload": "上传",
        "status": "状态",
        "enable": "启用",
        "disable": "禁用",
        "refresh": "刷新",
        "export": "导出",
        "enabled": "已启用",
        "disabled": "未启用",
        "operate": "操作",
        "downloadTmpl": "下载文件模板",
        "downloadTmpl2": "下载模板",
        "uploadFile": "上传文件",
        "selFile": "选择文件",
        "reupload": "重新上传",
        "uploadFileHint": "仅支持格式为CSV的文件",
        "confirmUpdate": "确认修改",
        "rightNow": "马上",
        "reset": "重置",
        "normal": "正常",
        "inactive": "已禁用",
        "UCName": "用户中心",
        "validate": "验证",
        "validateImmediately": "立即验证",
        "validateLater": "稍后验证",
        "validated": "已验证",
        "unvalidated": "未验证",
        "validateLoading": "正在验证，请稍候...",
        "prompt": "系统提示",
        "ok": "确定",
        "importAdLdap": "AD/LDAP导入",
        "import": "导入",
        "otherSettings": "其他配置",
        "syncPolicy": "同步策略",
        "syncTest": "测试",
        "addressBookSync": "通讯录同步",
        "userAuth": "用户认证",
        "lastSyncStatus": "上次同步",
        "otherInfo": "其他信息",
        "yes": "是",
        "no": "否",
        "type": "类型",
        "serverHost": "服务器地址",
        "serverPort": "服务器端口",
        "forever": "永久",
        "days": "__days__天",
        "months": "__months__个月",
        "years": "__years__年",
        "items": "__items__个",
        "noLimit": "不限制",
        "errorDetail": "错误详情",
        "giveUp": "放弃",
        "opFailed": "操作失败",
        "conflict": "冲突",
        "clickToDownload": "点击下载",
        "contain": "包含",
        "digit": "数字",
        "uppercase": "大写字母",
        "lowercase": "小写字母",
        "specialChar": "特殊字符",
        "containMore": "还需包含",
        "sendAgain": "重新发送",
        "name": "名称",
        "confTest": "配置测试",
        "minutes": "__minutes__分",
        "hours": "__hours__小时",
        "testAccount": "测试账号",
        "test": "测试",
        "markAsVerified": "标记为已验证",
        "markAsUnverified": "标记为未验证",
        "emailVerifiedMarker": "邮箱自动标示为已验证:",
        "phoneVerifiedMarker": "手机自动标示为已验证:",
        "testSuccess": "测试成功",
        "testfailed": "测试失败",
        "testing": "测试中",
        "noTestUserFound": "测试账号不存在",
        "saveAndVerify": "保存并验证",
        "smsCode": "短信验证码",
        "signature": "签名",
        "delPrompt": "删除提示",
        "add": "添加",
        "createTime": "创建时间",
        "copy": "拷贝",
        "regenerate": "重新生成",
        "copySuccess": "已复制到剪贴板",
        "help": "帮助",
        "adminView": "管理视图",
        "ssView": "个人视图",
        "minute": "分",
        "hour": "时",
        "day": "天",
        "authorized": "已授权",
        "unauthorized": "未授权",
        "customize": "自定义",
        "neverExpired": "永不过期",
        "termOfValidity": "有效期",
        "time": "时间",
        "otherSetting": "其他",
        "usercertPolicy": "用户证书",
        "auditSetting": "审计监控",
        noMatchFound : "没有找到匹配",
    },
    operator:{
        "eq":"等于",
        "ne":"不等于",
        "gt":"大于",
        "ge":"大于等于",
        "lt":"小于",
        "le":"小于等于",
        "has":"包含",
        "ew":"后缀包含",
        "sw":"前缀包含",
    },
    init: {
        "welcome": "欢迎使用用户中心控制台，请先配置相关参数。",
        "initConf": "初始化配置",
        "initConfItem": "初始化配置项",
        "userBaseAttrs": "用户基本属性",
        "requiredAttrs": "必填属性",
        "loginAttrs": "登录属性",
        "setBaseAttrsDesc": "必填属性为创建或编辑用户时必须填写的内容。",
        "setBaseAttrsWarning": "用户中心创建成功后，必填属性不可再次修改！",
        "setBaseAttrsWarning2": "如不勾选，不能使用忘记密码功能！",
        "addExtendAttrs": "添加扩展属性",
        "createPolicy": "配置策略",
        "userCntrName": "用户中心名称",
        "requiredUserAttrs": "用户必填属性",
        "userCntNameHint": "用户中心名称为用户中心控制台的名称，用户中心创建后可再次编辑。",
        "setBaseAttrsHint": "必填属性为创建或编辑用户时必须填写的内容，登录属性可作为登录信息。",
        "setBaseAttrsHint2": "用户中心创建成功后，必填属性和登录属性不可再次修改！",
        "addExtendAttrsHint": "添加的扩展属性会在用户信息中显示，用户中心创建后可再次编辑。",
        "createPolicyHint": "您可以为系统配置相关的基本设置，用户中心创建成功后可再次编辑。",
        "mailSmsConfHint": "您可以为系统设置邮件服务和短信网关，用户中心创建成功后可再次编辑。",
        "userLoginAttrs": "用户登录属性",
        "mailSmsSetting": "邮件短信设置"
    },
    user: {
        "login": "登录",
        "backToLogin": "返回登录",
        "accounting": "帐号管理",
        "user": "用户",
        "username": "用户名",
        "name": "姓名",
        "account": "帐号",
        "sex": "性别",
        "email": "邮箱",
        "phoneNum": "手机",
        "phoneNum2": "手机号",
        "alias": "别名",
        "addUser": "添加用户",
        "srchPlcHdr": "姓名/用户名/邮箱/手机",
        "pwd": "密码",
        "confirmPwd": "确认密码",
        "nickName": "昵称",
        "photo": "头像",
        "male": "男",
        "female": "女",
        "secret": "保密",
        "userDetail": "用户详情",
        "status": "用户状态",
        "createdAt": "创建时间",
        "updatedAt": "修改时间",
        "lastLogin": "上次登录",
        "latestGeos": "最近登录地址",
        "pwdChangedTime": "上次修改密码",
        "pwdExpirationTime": "密码过期",
        "pwdNeverExpire": "永不过期",
        "editUser": "编辑用户",
        "userAttrs": "用户属性",
        "editUserAttrs": "编辑用户属性",
        "updatePwd": "修改密码",
        "inputOldPwd": "输入旧密码",
        "inputNewPwd": "输入新密码",
        "confirmNewPwd": "确认新密码",
        "resetPwd": "重置密码",
        "importUsersByFile": "文件导入用户",
        "importNoConflictUsers": "仅导入不冲突用户",
        "getValidateEmail": "获取验证邮件",
        "userAttrMap": "用户属性对应关系",
        "orgAttrMap": "组织结构属性对应关系",
        "userBasicAttrMap": "用户基本属性对应关系",
        "sendActivateInvite": "发送激活邀请邮件",
        "adminAccount": "管理员帐号",
        "adminPwd": "管理员密码",
        "userPattern": "用户搜索条件",
        "groupPattern": "用户组搜索条件",
        "firstName": "名",
        "lastName": "姓",
        "orgFramework": "组织结构",
        "userMgr": "用户管理",
        "importAnyway": "继续导入",
        "errorDetailMsg": "共__total__条用户信息，其中__error__条存在错误。选择“继续导入”，错误用户将被忽略；选择“放弃”，则取消本次导入。请谨慎操作！",
        "allErrorMsg": "共__total__条用户信息，全部导入错误。请修改后再次尝试。",
        "userConflict":  "共__total__条用户信息，存在__conflict__名冲突用户。选择全部导入，冲突用户将覆盖原用户信息，请谨慎操作！",
        "hasUserConflicted": "系统发现一个未完成的用户导入任务， 共__total__条用户信息，存在__conflict__名冲突用户。选择全部导入，冲突用户将覆盖原用户信息，请谨慎操作！您也可以点击取消按钮。",
        "userImportMsg": "共__total__条用户信息，请继续导入用户。",
        "hasUserImported": "系统发现一个未完成的用户导入任务，共__total__条用户信息，请继续导入用户，或者点击取消按钮。",
        "youCan": "您可以",
        "downloadToCsv": "这些用户的详细信息到csv文件，其中包含用户的初始密码。",
        "userImport": "用户导入",
        "accountInfo": "帐号信息",
        "editAccount": "编辑帐号",
        "inputEmail": "输入邮箱",
        "validateEmail": "验证邮箱",
        "userInfoTabHeader" : "用户信息",
        "appInfoTabHeader" : "应用信息",
        "userCertTabHeader" : "设备证书",
        latestLoginActivity: {
            geo: {
                tip: "最近登录地址",
                cols: {
                    timestamp: "登录时间",
                    country: "登录国家",
                    city: "登录城市",
                    ip: "IP",
                    geo: "经纬度",
                },
            },
        },
        usercerts: {
            text: {
                never_used: "未使用",
            },
            prompt: {
                delete: "确定要删除证书吗？ 删除后，使用该证书的设备可能无法登录!",
            },
            cols: {
                device_id: "设备标识",
                device_model: "设备类型",
                upload_at: "上传时间",
                expire_at: "过期时间",
                recently_used_at: "上次使用",
                kty: "证书类型",
                alg: "加密算法",
                status: "状态",
                action: "操作",
            },
        },
        attr:{
            username: "用户名",
            nickname: "昵称",
            first_name: "名",
            last_name: "姓",
            email: "邮箱",
            name: "姓名",
            preferred_username: "别名",
            phone_number: "手机号",
            employee_number: "员工编号",
            gender: "性别",
            address: "地址",
            birthdate: "生日",
            cost_center: "结算中心",
            division: "分支结构",
            telephone_number: "座机号",
            title: "职位",
            manager: "上级经理",
            locale: "工作地",
            website: "个人主页",
            zoneinfo: "时区",
            sort_order: "排序号",
            picture: "头像",
            cert: "用户证书",
            tag: "静态标签",
            group: "组织结构",
            sub: "用户ID",
            type: "用户类型",
            email_verified: "邮箱已校验",
            phone_number_verified: "手机已校验",
            dynamic_tag: "动态标签",
            last_login: "上次登录时间",
            login_geo: "上次登录地理位置",
            profile: "用户资料URL",
            pwd_changed_time: "密码修改时间",
            pwd_expiration_time: "密码过期时间",
            created_mode: "创建模式",
            created_by: "创建者",
            created_at: "创建时间",
            updated_by: "更新者",
            updated_at: "更新时间",
            status: "状态",
            org_ids: "部门IDs"
        },
    },
    org: {
        "org": "组织机构",
        "addOrg": "创建组织",
        "orgName": "组织名称",
        "searchPlaceholder": "组织名称/描述",
        "relatedUsers": "关联用户",
        "relatedSubOrgs": "关联子组",
        "higherOrg": "上级组",
        "higherOrg2": "所属上级组",
        "orgInfo": "组织详情",
        "editOrg": "编辑组织",
        "defaultOrg": "默认组",
        "newOrg": "新建组织",
        "newSub": "新建下级",
        "newBrother": "新建同级",
        attr: {
            "name":"用户组名称",
            "status":"用户组状态",
            "description":"用户组描述",
            "distinguishedName": "用户组唯一标示"
        }
    },
    app: {
        "app": "应用",
        "add": "添加应用",
        "name": "应用名称",
        "detail": "应用详情",
        "edit": "编辑应用",
        "type": "应用类型",
        "status": "应用状态",
        "showClientSecret": "显示Client Secret",
        "appBriefIntro": "应用简介",
        "appIcon": "应用图标",
        "appProfileRef": "用户画像",
        "profileRefDropDown" : "选择用户画像",
        "appHomePage": "应用主页",
        "webHookEnable": "数据推送",
        "webHookUrl": "数据推送地址",
        "signatureCert": "签名证书",
        "addRedirectURI": "新增RedirectURI",
        "regenerate": "重新生成Client Secret",
        "accessTokenTimeout": "Access Token 有效期",
        "idTokenTimeout": "ID Token 有效期",
        "refreshTokenTimeout": "Refresh Token 有效期",
        "cancelAuthorization": "取消授权",
        "myApp": "我的应用",
        "licenseFreeApp": "免授权提示",
        "trustedPeers": "代理授权",
        extraAuthFactors: "登录时验证用户其他属性",
        authWithCert: "登录时验证用户软证书",
        extraAuthFactorsDropDown : "选择需要验证的其他属性",
        "tagListDropDown" : "选择需要添加的标签",
        "trustedPeersDropDown" : "选择信任的主应用",
        "enableCliMode" : "CLI模式",
        "enableQRCodeLogin" : "允许扫码登录",
        "enableOneTimePwd" : "允许一次性密码登录",
        "enableSecureLogin" : "启用密码加密登录",
        "authorizationError": "用户中心应用授权错误",
        "appTabHeader": "应用详情",
        "entitlementTabHeader": "应用授权",
        "permTabHeader": "应用权限",
        "entitlementCommonHeader": "公共应用",
        "entitlementUserHeader": "用户授权",
        "entitlementOrgHeader": "组织结构授权",
        "entitlementTagHeader": "标签授权",
        "syncUserData": "同步用户数据",
        "syncOrgData": "同步组织数据",
        info: {
            panels: {
                basic: "基本信息",
                token: "Token 有效期",
                cert: "ID Token 签名证书",
                policy: "登录策略",
                climode: "CLI模式",
            },
        },
        perm: {
            tip: "用户在通过身份认证后，用户中心会把此帐号在应用内的角色返回给应用，应用根据权限名称决定此帐号的权限与业务逻辑.",
            permHeader: "应用权限",
            permSetHeader: "应用权限组",
            roleHeader: "应用角色",
            perm: {
                searchPlaceholder: "权限名称/显示名/描述",
                tbl: {
                    cols: {
                        name: "权限名称",
                        displayName: "显示名称",
                        payload: "权限内容",
                        desc: "描述",
                        action: "操作",
                    }
                },
                action: {
                    add: "添加权限",
                    edit: "编辑权限",
                    delete: "删除权限",
                },
                tip: {
                    add: "权限名称作为应用内权限的唯一标识，系统推荐采用英文命名,并推荐用<动作>:<资源名>的格式来建模. 例如：read:contact,create:appointment,delete:mail",
                    payload: "权限内容可以为任意形式的字符串，JSON/XML/数组等.第三方应用可以把权限相关的一些metadata存储在这个字段中."
                }
            },
            permSet: {
                searchPlaceholder: "权限组名称/显示名/描述",
                tbl: {
                    cols: {
                        name: "权限组名称",
                        displayName: "显示名称",
                        desc: "描述",
                        action: "操作",
                    }
                },
                action: {
                    add: "添加权限组",
                    edit: "编辑权限组",
                    delete: "删除权限组",
                },
                tip: {
                    add: "权限组是相同类型权限的逻辑分组, 系统推荐采用英文命名."
                }
            },
            role: {
                searchPlaceholder: "角色名称/显示名/描述",
                perm: "权限",
                tabs: {
                    info: "基本信息",
                    permSets: "权限组",
                    perms: "权限",
                },
                tbl: {
                    cols: {
                        name: "角色名称",
                        displayName: "显示名称",
                        desc: "描述",
                        action: "操作",
                    }
                },
                action: {
                    add: "添加角色",
                    edit: "编辑角色",
                    delete: "删除角色",
                    bind: "绑定",
                },
                tip: {
                    add: "角色名称作为应用内角色的唯一标识，系统推荐采用英文命名. 例如：PROJECT_ADMIN, PROJECT_VIEWER",
                }
            },
            binding: {
                title: "绑定",
                org: {
                    title: "组织结构",
                    searchPlaceholder: "绑定组织结构",
                },
                user: {
                    title: "用户",
                },
                tag: {
                    title: "标签",
                },
                scope: {
                    title: "设置管理范围",
                },
                tip: {
                    scope: "若不指定，缺省管理范围为用户所在的组织结构.",
                }

            }
        },
        tip: {
            native : "移动端Native 应用, 包括IOS和Android两个平台. 详情请参考在线帮助->开发者->单点登录集成.",
            web: "传统的用户通过浏览器访问的Web Application. 比如JAVA体系下，后台运行环境Tomcat, Struts/Spring/Hibernate. 详情请参考在线帮助->开发者->单点登录集成.",
            spa: "前后端分离的Single Page Application. 比如用AngularJS/ReactJS/VueJS等主流框架搭建的SPA. 详情请参考在线帮助->开发者->单点登录集成.",
            trusted: "Trusted Application是指登录页面是第三方应用自己Host的应用，通常意味着用户的密码，会传递给这种应用去做登录. 详情请参考在线帮助->开发者->单点登录集成.",
            cli: "CLI Application是指机器A和机器B之间的互相交互, 比如运行在某服务器后台中，用Shell脚本搭建的Cron Job. 详情请参考在线帮助->开发者->单点登录集成.",
            restricted: "输入受限设备中运行的应用, 通常是指屏幕尺寸非常有限，没有键盘，基本和用户没有交互的设备中运行的应用， 这种应用也需要用户身份去访问某些敏感资源. 详情请参考在线帮助->开发者->单点登录集成.",
            publicAccess: "所有人都可以使用该应用. 若不开启，可以单独对组织结构或用户进行授权.",
        },
        entitlement: {
            publicAccess: "允许所有人使用",
            user: {
                searchPlaceholder: "添加用户",
                tbl: {
                    cols: {
                        username: "用户名",
                        name: "姓名",
                        email: "邮箱",
                        phone: "手机",
                        scope: "范围",
                        action: "操作",
                    }
                },
                action: {
                    addSuccessPrompt: "添加用户成功,该用户可以使用应用",
                    deleteSuccessPrompt: "移除用户成功,该用户将无法使用应用",
                }
            },
            tag: {
                searchPlaceholder: "添加标签",
                action: {
                    addSuccessPrompt: "添加标签成功,该标签所包含的用户可以使用应用",
                    deleteSuccessPrompt: "移除标签成功,该标签将无法使用应用",
                }
            },
            group: {
                searchPlaceholder: "添加组织结构",
            },
        }
    },
    tenant: {
        "tenant": "租户",
        "detail": "租户详情",
        "edit": "编辑详情",
        "add": "添加租户",
        "id": "租户ID",
        "name": "名称",
        "address": "地址",
        "contacts": "联系人",
        "phone": "电话",
        "email": "邮箱",
        "status": "状态",
        "createTime": "创建时间",
        "expiredTime": "过期时间",
        "updateTime": "更新时间",
        "funcNames": "开通功能",
        "domain": "租户域名",
        "username": "管理员账号",
        "password": "管理员密码",
        "userPhone": "管理员电话",
        "userEmail": "管理员邮箱",
        info: {
            panels: {
                basic: "基本信息"
            }
        }
    },
    rbac: {
        menu: "权限管理",
        breadcrumb: "权限管理",
        permsetTree: {
            tags: {
                user: "用户",
                tag: "标签",
                profile: "用户画像",
                accounting: "帐号管理",
                org: "组织机构",
                datasource: "链接器",
                ext_attr: "扩展属性",
                application: "应用管理",
                app: "应用",
                audit: "审计日志",
                role: "应用权限",
                settings: "设置",
            },
        },
        systemRoles: {
            superadmin: {
                display: "系统管理员",
                desc: "系统管理员，具有最高权限，可以进行一切操作.",
            },
            useradmin: {
                display: "帐号管理员",
                desc: "帐号管理员，可以进行用户帐号相关的操作，包括户帐号管理，组织结构管理，扩展属性管理.",
            },
            appadmin: {
                display: "应用管理员",
                desc: "应用管理员，可以进行应用管理，应用权限角色管理，应用分配，应用角色分配等.",
            },
        },
        bindings: {
            menu: "管理员帐号",
            breadcrumb: "管理员帐号",
            srchPlcHdr: "姓名/用户名/邮箱/手机",
            tbl: {
                cols: {
                    role: "角色",
                    username: "用户名",
                    name: "姓名",
                    scope: "管理范围",
                    action: "操作",
                }
            },
            tabs: {
                by_system: "系统内置",
                by_user: "用户自定义",
            },
        },
        roles: {
            menu: "管理员角色",
            breadcrumb: "管理员角色",
            srchPlcHdr: "角色名称",
            tbl: {
                cols: {
                    name: "角色名称",
                    lastUpdate: "更新时间",
                    action: "操作",
                }
            },
        },
    },
    attr: {
        "extendedAttr": "扩展属性",
        "name": "名称",
        "showName": "显示名称",
        extraAuthFactor: "可作为登录校验因子",
        extraAuthFactorTip: "当Trusted App进行身份认证时，除了验证用户名+密码外，该属性是否可以作为其他校验因子. 见Trusted App的编辑页面.",
        "prmDesc": "描述",
        "srchPlaceholder": "名称/显示名称",
        "createAttr": "创建属性",
        "editAttr": "编辑属性",
        "attrDetail": "属性详情"
    },
    tag: {
        "menu": "标签",
        "breadcrumb": "标签",
        "name": "名称",
        "desc": "描述",
        "type": "类型",
        "expression": "表达式",
        "srchPlaceholder": "名称/描述",
        "createTag": "创建标签",
        "editTag": "编辑标签",
        "deleteTag": "删除标签",
        "static": "静态标签",
        "dynamic": "动态标签",
        "expressionTreeDisplay":"动态标签表达式树状结构表示。点击树节点进行编辑或新增操作",
        "expressionRawDisplay":"动态标签表达式",
        "addExpression":"添加",
        "saveExpression":"保存",
        "delOperator":"删除该操作符",
        "modifyChosenExpression":"点击删除按钮时，选中的表达式将被删除，同时该表达式的上级(and/or)节点也将被删除",
        "addNewExpression":"增加新的表达式。增加新表达式时，需要选择新表达式与选中表达式的逻辑关系，and表示并且，新增表达式和选中表达式条件均需要满足。or表示或者，新增表达式和选中表达式条件满足其一即可。",
    },
    setting: {
        "setting": "系统设置",
        "settings": "设置",
        "createCountPerm": "创建帐号权限",
        "allowSelfRegist": "允许用户自己注册",
        "notAllowSelfRegist": "不允许用户自己注册",
        "pwdRule": "密码复杂度",
        "pwdRuleCont": "至少包含1个字母和1个数字，且密码长度最少为8位。",
        "emailServiceConf": "邮件服务设置",
        "SmsGatewayConf": "短信网关设置",
        "SMTPServer": "SMTP服务器",
        "port": "端口号",
        "addressor": "发件人",
        "emailAccount": "邮箱帐号",
        "allowAdminEditPwd": "管理员重置用户密码",
        "changePwdFirstLogin": "首次登录修改密码",
        "pwdPolicy": "密码策略",
        "containDigit": "包含数字",
        "containUppercase": "包含大写字母",
        "containLowercase": "包含小写字母",
        "containSpecialChar": "包含特殊字符",
        "pwdMinLength": "密码最短长度",
        "forcePwdHistory": "强制密码历史",
        "pwdTerm": "密码有效期",
        "gatewayAddr": "网关地址",
        "onetimePasswordEnable": "允许一次性密码登录",
        "secureLoginEnable": "启用密码加密登录",
        "qrCodeEnable": "允许二维码登录",
        "ssoValidity": "SSO会话有效期",
        "closeBrowserExpire": "关闭浏览器后立即失效",
        auditLevel: "日志级别",
        auditLevelOff: "关闭",
        auditLevelInfo: "信息",
        auditLevelError: "错误",
        "auditLogMaxAge": "日志保存时间",
        "loginFailureAlertPolicy": "登录失败告警",
        "crossReginLoginAlertPolicy": "异地登录告警",
        "max_cert_number_per_user": "允许的证书个数",
        "cert_expiration_policy": "证书有效期",
        "cert_rotation_policy": "自动覆盖老证书",
        "cert_rotation_policy_tip": "当用户证书数量超出限制时，新证书将自动覆盖最不经常使用的证书.",
        "loginPolicy": "登录策略",
        userLoginAttrsTip: "除了用户名登录以外，还可以指定其他属性用来登录，比如手机号或者邮箱、用户别名等.",
    },
    template: {
        "msgTemplate": "消息模板",
        "emailInviteTmpl": "邮件邀请模板",
        "emailValidateTmpl": "邮箱验证模板",
        "editEmailValidateTmpl": "编辑邮箱验证模板",
        "pwdResetTmpl": "密码重置模板",
        "editPwdResetTmpl": "编辑密码重置模板",
        "emailTitle": "邮件主题",
        "emailContent": "邮件内容",
        "smsTitle": "短信主题",
        "smsContent": "短信内容",
        "smsTmpl": "短信模板"
    },
    message: {
        "loginFailure": "登录失败！",
        "invalid_username_or_pwd": "用户名或密码错误！",
        "editFailure": "修改失败！",
        "editSuccess": "修改成功！",
        "addFailure": "创建失败！",
        "addSuccess": "创建成功！",
        "delUserPrompt": "确定要删除已选用户吗？",
        "delOrgPrompt": "确定要删除已选组织吗？",
        "delLinkerPrompt": "如果删除链接器，用户也一同被删除，是否继续？",
        "delTagPrompt": "如果删除标签，相关的应用和应用角色授权将会被删除，是否继续？",
        "delProfilePrompt": "如果删除用户画像，与之关联的应用的用户画像也会收到影响，是否继续？",
        "delAppPrompt": "确定要删除所选应用吗？",
        "delAppTip": "应用删除后相关功能失效，删除操作不可恢复，请谨慎操作！",
        "deleteFailure": "删除失败！",
        "deleteSuccess": "删除成功！",
        "activeFailure": "启用失败！",
        "activeSuccess": "启用成功！",
        "inactiveFailure": "禁用失败！",
        "inactiveSuccess": "禁用成功！",
        "registFailure": "注册失败！",
        "registSuccess": "注册成功！",
        "resetPwdSuccess": "密码重置成功！",
        "pwdChg": "密码修改成功，请重新登录。",
        "validateEmailSuccess": "邮箱验证成功！",
        "validateMobileSuccess": "手机验证成功！",
        "validateEmailFailure": "邮箱验证失败！",
        "requiredEmailIfChecked": "勾选后邮箱为必填项",
        "requiredMobileIfChecked": "勾选后手机为必填项",
        "requireCSVFiles": "文件格式错误",
        "forcedUpdatePwd": "为确保帐号安全，需要您重新设置密码",
        "requireValidateEmail": "为了您的帐号安全，__platform__需要验证您的邮箱。",
        "yourEmailValidated": "您的邮箱__email__已被验证",
        "yourEmailValidatFailure": "您的邮箱验证链接已失效，请重新获取验证邮件并验证邮箱",
        "exportFailure": "导出失败",
        "emailSent": "邮件已发送！",
        "emailSentMsg1": "验证邮件已发送到",
        "emailSentMsg2": "，请尽快验证邮箱。",
        "emailSentMsg3": "没有收到邮件？请",
        "smsSent": "短信已发送！",
        "smsSentTip": "验证短信已发送到__mobile__，请在__minutes__分钟内验证手机。没有收到短信？请",
        "emailSentTip": "验证邮件已发送到__email__，请尽快验证邮箱。没有收到邮件？请",
        "smsCodeExpired": "您的手机验证码已失效，请重新获取验证码",
        "smsCodeErr": "您的手机验证码错误，请重新输入验证码",
        "imgSize": "图片大小超过限制。",
        "imgHWSize": "图片尺寸错误。",
        "imgTypeErr": "图片类型错误。",
        "regenerate": "系统会重新生成Client Secret，应用必须使用新的Client Secret。"
    },
    tip: {
        "forcePwdHistory": "设置强制密码历史以确保旧的密码不会被重新使用。",
        "changePwdFirstLogin": "如果勾选，由管理员设置或重置的密码，用户首次登录必须修改密码。由AD/LDAP同步的用户不受此限制。",
        auditLevel: "审计日志级别, 从低到高，分为 关闭, 错误, 信息, 等级越高记录的日志越详细.",
        loginFailureAlertPolicy: "如果勾选，当用户在5分钟内连续登录失败3次时，将会给管理员和该用户发送告警邮件",
        crossReginLoginAlertPolicy: "如果勾选，当用户在不同的城市登录时，将会给管理员和该用户发送告警邮件",
        "pwdToBeExpired": "密码将在__days__天后过期，请尽快修改密码！",
        "name": "名称创建后不能修改",
        "confTest": "在保存配置前，请先输入一个已经存在于AD/LDAP的用户账号，验证配置信息的正确性，验证成功后您可以查看此账号被导入的信息.",
        "wantEmail": "希望获取您的邮箱地址，您可以通过此邮箱找回密码",
        "appProfileRef": "该应用所使用的用户画像",
        "appHomePage": "应用的主页",
        "trustedPeers": "代理者(主应用)给被代理的应用授权。常见的应用场景比如, \"主应用扫。码登录其他应用\"。更多应用场景请参考管理员使用手册.",
        authWithCert: "登录时，除了验证用户名+密码外，必须校验用户的软证书. 一个用户可以同时拥有多个软证书.",
        "extraAuthFactors": "登录时，除了验证用户名+密码外，还需要额外验证用户的其他属性.",
        "nativeRedirectURIs": "scheme为应用自定义或http，当为http时hostname必须是localhost。",
        "spaRedirectURIs": "scheme可以是https或http，推荐使用更安全的https协议。且hostname不能是localhost。",
        "webRedirectURIs": "scheme可以是https或http，推荐使用更安全的https协议。",
        "enableCliMode": "开启后，允许应用通过Client ID/Client Secret来调用用户中心的后台API. 即类似CLI应用的功能，详细接口请参见开发者文档.",
    },
    validate: {
        "required": "必填项不能为空",
        "imgType": "仅支持50KB以内的jpg、jpeg、png图片",
        "ipFormatErr": "IP地址格式不正确",
        "formatErr": "输入格式不正确",
        "emailFormatErr": "邮箱格式不正确",
        "telFormatErr": "电话号码格式不正确",
        "isAccount": "只可填写字母、数字、下划线、点号和@",
        "notEmailFormat": "不能包含@符号",
        "notTelFormat": "不能以数字开头",
        "noSpecChar": "不可填写特殊字符",
        "isFieldName": "只可填写字母、数字、下划线和减号",
        "isUserName": "只可填写字母、数字、下划线和减号以及点号",
        "isUserNamePrefix": "只可填写字母、数字、下划线、反斜线和减号以及点号",
        "isUserNameSuffix": "只可填写字母、数字、下划线、反斜线和减号以及点号",
        "isTagName": "不能包含以下特殊字符/\\<>#%{}|~\[\]`;?:@=&",
        "isProfileName": "只可填写字母、数字、下划线和减号,长度3到50",
        "isCenterName": "只可填写字母、数字、汉字、空格、下划线和减号",
        "isProgID": "程序ID格式不正确",
        "isHost": "地址格式不正确",
        "isPort": "服务器端口应该是0 – 65535之间的整数",
        "isServer": "服务器格式不正确",
        "isEqual": "两次密码不一致",
        "isDomainName": "可输入字母、数字，但不能以数字开头",
        "noSpace": "不允许输入空格",
        "isLinkerName": "不能填写正斜杠、反斜杠",
        "isSignature": "不允许输入'- . + #'等特殊字符",
        "urlErr": "地址不正确",
        "appIconType": "仅支持108*108像素，大小50KB以内的png图片"
    },
    importErrCode: {
        "10001": "目标服务存在重复的用户名",
        "10002": "用户名与系统帐号重复",
        "10003": "缺少必填用户属性__key__",
        "10004": "必填属性__key__不能为空",
        "10005": "导入用户与系统内同步的用户冲突",
        "20002": "非法属性值",
        "20003": "长度错误",
        "20004": "导入的csv文件列数错误",
        "20005": "导入的csv文件包含不支持的列"
    }
};
let util = {
    //国际化
    t(i18nStr, params) {
        let names = i18nStr.split("."),
            newStr = i18n;
        /**
         * support of more than 2 depth
         */
        for (const k of names) {
            if (newStr[k]) {
                newStr = newStr[k];
            } else{
                //key not found, return empty string instead
                return "";
            }
        }

        if (!params) {
            return newStr;
        } else {
            for(const i in params) {
                if (params.hasOwnProperty(i)){
                    newStr = newStr.replace("__" + i + "__", params[i]);
                }
            }
            return newStr;
        }
    },
    handleInput(e) {
        var text = e.data;
        if (e.target.className.indexOf("js-freeInput") !== -1) {
            return;
        }
        if (text.search(/[&<>"']/) !== -1) {
            if (e.type === "textInput") {
                e.preventDefault();
            } else {
                e.target.value = e.target.value.replace(/[&<>"']/g, "");
            }
        }
    },
    filterDangerousChars(inputCntr) {
        var cntr = inputCntr || document.getElementById("root");
        const inputs = cntr.querySelectorAll("input[type='text'], input[type='password'], textarea");
        const len = inputs.length;
        for (let i = 0; i < len; i += 1) {
            if (navigator.userAgent.indexOf("Trident") === -1) {
                inputs[i].addEventListener("textInput", this.handleInput, false);
            } else {
                inputs[i].addEventListener("textinput", this.handleInput, false);
            }
        }
    },
    createQueryString(params) {
        var str = "?", param;
        for (param in params) {
            if (params.hasOwnProperty(param)) {
                str = str + param + "=" + encodeURIComponent(params[param]) + "&";
            }
        }
        return str.slice(0, -1);
    },
    setPagination(pagination, targetComponent) {
        targetComponent.setState({
            pagination: pagination
        });
        const params = {
            size: pagination.pageSize,
            page: (pagination.current - 1) * pagination.pageSize
        };
        return params;
    },
    returnFirstPage(targetComponent) {
        const newPagination = Object.assign({}, targetComponent.state.pagination, {
            current: 1
        });
        targetComponent.setState({
            pagination: newPagination
        });
    },
    base64Encode(str) {
        return window.btoa(unescape(encodeURIComponent(str))).replace(/\//g, "_");
    },
    showSuccessMessage(msg) {
        message.success(msg || "操作成功", 2.5);
    },
    showErrorMessage(error) {
        let msg;
        if (error && error.response && error.response.data &&
            error.response.data.error) {
            if (error.response.data.error === "1010202" && error.response.config.url.indexOf("self/forget_password") === -1) { //此处由于在app.js的拦截器里有设置，就不再重复弹出信息
                return;
            }
            if (this.errorCode[error.response.data.error]) {
                msg = this.errorCode[error.response.data.error];
            } else {
                msg = "操作失败";
            }
            if (error.response.data.error === "1010202" && error.response.config.url.indexOf("self/forget_password") !== -1) {
                msg = "用户被禁用，请联系管理员。";
            }
        } else if (typeof error === "string") {
            msg = error;
        } else {
            msg = "操作失败";
        }
        message.error(msg, 2.5);
    },
    refresh() {
        window.location.reload();
    },
    openLink(href){
        if (href) {
            window.open(href + '?tcode=' + localStorage.getItem("tcode"));
        }
        return false;
    },
    errorCode: {
        "10006": "列数不匹配",
        "1010005": "组内用户过多，请缩小查询范围",
        "1010007": "平台未初始化成功，请联系管理员",
        "1010010": "用户ID或名称或电话重复”",
        "1010103": "验证码不存在",
        "1010104": "验证码过期",
        "1010105": "验证码无效",
        "1010200": "用户名或密码错误",
        "1010201": "系统无此用户",
        "1010202": "该用户已失效，返回到登录页面",
        "1010203": "用户名重复，请重新创建",
        "1010210": "无法找回密码",
        "1010211": "此邮箱已被验证",
        "1010212": "需要修改密码",
        "1010213": "用户不能修改密码，旧密码状态无效",
        "1010214": "用户被禁用，请联系管理员",
        "1010215": "旧密码输入错误",
        "1010217": "管理员重置密码后，需要修改密码",
        "1010218": "密码已过期。请尝试忘记密码或者联系管理员重置密码",
        "1010219": "新密码和历史密码重复，请重新设置",
        "1010227": "缺少邮箱和手机信息，无法找回密码",
        "1010228": "无权限操作只读用户",
        "1010302": "创建失败！所属上级组织内已有重名组织，请重新操作",
        "1010402": "扩展属性名称已经存在，请重新填写",
        "1010407": "扩展属性数量已经达到上限",
        "1010602": "存在相同名称的链接器",
        "1010603": "存在相同目标服务的链接器",
        "1010607": "同步到系统中的组与现有组重名",
        "1010901": "导入文件类型错误",
        "1010902": "导入文件内容不能为空",
        "1010903": "导入文件大小不能超过 5 MB",
        "1010904": "不能识别导入文件的字符集",
        "1010905": "另一个用户导入文件正在上传中，请等待",
        "1010906": "另一个用户导入任务正在处理中，请继续处理或取消该任务",
        "1010909": "导入用户任务正在取消",
        "1010910": "导入文件读取错误",
        "1010911": "导入文件第一行缺少必要用户属性信息",
        "1010912": "导入文件中包含系统内置用户，请在文件中删除此用户后重新导入",
        "1010913": "导入文件中存在重复的用户扩展属性列",
        "1010914": "导入文件中存在不支持的用户扩展属性列",
        "1010915": "用户名与已同步用户冲突",
        "1010920": "连接请求被拒绝",
        "1010921": "服务器连接超时",
        "1010922": "与目标服务器握手失败",
        "1010923": "用户名或密码错误",
        "1010924": "目标baseDN未找到",
        "1010925": "未找到用户数据",
        "1010927": "管理员帐号权限不足",
        "1010928": "未找到相关组",
        "1010931": "文件导入用户不能超过 5000 条",
        "1010940": "一个任务正在同步中，请稍后操作",
        "1010941": "不能修改该配置文件的BaseDN",
        "1010942": "此链接器正在同步中，请耐心等待",
        "1011304": "证书不存在",
        "1111102": "无权限访问",
        "1011210": "标签已存在，请重新创建",
        "1011211": "未找到指定标签",
        "1010002": "输入参数有误",
        "client_already_exists": "应用已存在",
        "1011505": "用户画像已存在，请重新创建",
        "1011500": "未找到指定用户画像",
        "40086": "不合法的第三方应用appid",
        "40013": "不合法的corpid",
        "40089": "不合法的corpid或corpsecret或者不合法的appkey或appsecret",
        "41002": "缺少corpid参数",
        "41027": "需要授权企业的corpid参数",
        "52010": "无效的corpid",
        "90004": "您当前使用的CorpId及CorpSecret被暂时禁用了，仅对企业自己的Accesstoken有效",
        "90006": "您当前使用的CorpId及CorpSecret调用当前接口次数过多，请求被暂时禁用了，仅对企业自己的Accesstoken有效",
        "900010": "计算解密文字corpid不匹配",
        "90017": "此IP使用CorpId及CorpSecret调用接口的CorpId个数超过限制",
        "90001": "您的服务器调用钉钉开放平台所有接口的请求都被暂时禁用了",
        "90002": "您的服务器调用钉钉开放平台当前接口的所有请求都被暂时禁用了",
        "40056": "不合法的agentid",
        "41011": "缺少agentid",
        "52019": "无效的agentid",
        "70003": "agentid对应微应用不存在",
        "70004": "企业下没有对应该agentid的微应用",
        "52023": "无效的服务窗agentid",
        "71006": "回调地址已经存在",
        "71007": "回调地址已不存在",
        "71012": "url地址访问异常",
        "400040": "回调不存在",
        "400041": "回调已经存在",
        "400050": "回调地址无效",
        "400051": "回调地址访问异常",
        "400052": "回调地址访返回数据错误",
        "400053": "回调地址在黑名单中无法注册",
        "400054": "回调URL访问超时",
        "60020": "访问ip不在白名单之中",
        "60121": "找不到该用户"
    },
    parseQueryString (url) {
        var i, len, result, pair, queryObj = {};
        result = (url || location.search).match(/[\?\&][^\?\&]+=[^\?\&]+/g);
        if (result !== null) {
            for (i = 0, len = result.length; i < len; i += 1) {
                pair = result[i].slice(1).split("=");
                queryObj[pair[0]] = decodeURIComponent(pair[1]);
            }
        }
        return queryObj;
    },
    CookieUtil : {
        hasCookie(key) {
            const cookieName = ";" + key + "=";
            const str = ";" + document.cookie.replace(/\s/g, "");
            return str.indexOf(cookieName) !== -1;
        },
        get: function (name) {
            let cookieName = encodeURIComponent(name) + "=",
                cookieStart = document.cookie.indexOf(cookieName),
                cookieValue = null;
            if (cookieStart > -1) {
                let cookieEnd = document.cookie.indexOf(";", cookieStart);
                if (cookieEnd === -1) {
                    cookieEnd = document.cookie.length;
                }
                cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
            }
            return cookieValue;
        },
        set: function (name, value, expires, path, domain, secure) {
            let cookieText = encodeURIComponent(name) + "=" +
                encodeURIComponent(value);
            if (expires instanceof Date) {
                cookieText += "; expires=" + expires.toUTCString();
            }
            if (path) {
                cookieText += "; path=" + path;
            }
            if (domain) {
                cookieText += "; domain=" + domain;
            }
            if (secure) {
                cookieText += "; secure";
            }
            document.cookie = cookieText;
        },
        unset: function (name, path, domain, secure) {
            if (conf.getConfig().debug) {
                domain = ".nscloud.local";
            }
            this.set(name, "", new Date(0), path, domain, secure);
        }
    },
    disabledBtnByFields(fieldsError, requiredValues) {
        const hasEmptyStr = Object.values(requiredValues).some(
            value => ((value && value.toString().trim()) === "") || (value === null)
        );
        return hasEmptyStr || JSON.stringify(fieldsError) !== "{}";
    },
    clearAllStorage() {
        staticMethod.clearWebAuth(() => {
            sessionStorage.clear();
            localStorage.clear();
            if (navigator.userAgent.indexOf("Trident") > 0) {
                try {   //用try-catch来解决ie10不支持这个函数导致的js出错，防止阻塞js线程
                    document.execCommand("ClearAuthenticationCache");//ie清除cookie
                } catch (e) {
                    //Nothing
                }
            }
            axios.defaults.baseURL = "";
            axios.defaults.headers.common.Authorization = "";
            sessionStorage.setItem("reduxPersist:login", JSON.stringify({
                loggedIn: false
            }));
        });
    },
    clearLoginStorage() {
        staticMethod.clearWebAuth(() => {
            sessionStorage.clear();
            localStorage.removeItem("access_token_tc");
            localStorage.removeItem("id_token_tc");
            localStorage.removeItem("expires_in");
            localStorage.removeItem("access_token_received_at");
            if (navigator.userAgent.indexOf("Trident") > 0) {
                try {   //用try-catch来解决ie10不支持这个函数导致的js出错，防止阻塞js线程
                    document.execCommand("ClearAuthenticationCache");//ie清除cookie
                } catch (e) {
                    //Nothing
                }
            }
            axios.defaults.baseURL = "";
            axios.defaults.headers.common.Authorization = "";
            sessionStorage.setItem("reduxPersist:login", JSON.stringify({
                loggedIn: false
            }));
        });
    },
    //筛选出dirty的表单keys, origKeys:原始key数组;judgeFunc:"antd"的isFieldTouched方法
    filterTouchedKeys(origKeys, judgeFunc) {
        return origKeys.filter((item) => judgeFunc(item));
    },
    isPC() {
        var userAgentInfo = navigator.userAgent,
            agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
        return agents.every(function (item) {
            return userAgentInfo.indexOf(item) === -1;
        });
    },
    isLandscape() {
        return window.innerHeight < window.innerWidth;
    },
    formatDateTime (value, placeholder="--") {
        if (Number.isInteger(value)) {
            const time = new Date(value), year = time.getFullYear(),
                month = time.getMonth() + 1, day = time.getDate(),
                hour = time.getHours(), min = time.getMinutes(),
                sec = time.getSeconds();
            return `${year}-${("0" + month).slice(-2)}-${("0" + day).slice(-2)} ` +
                `${("0" + hour).slice(-2)}:${("0" + min).slice(-2)}:${("0" + sec).slice(-2)}`;
        }
        return placeholder;
    },
    /**format unix timestamp*/
    formatUnixTimestamp(value, placeholder="--") {
        if (value == null) {
            return placeholder;
        } else if (Number.isInteger(value)) {
            return this.formatDateTime(value * 1000, placeholder);
        } else {
            return placeholder;
        }
    },
    handleRedirectError(callback) {
        const href = window.location.href;
        const params = this.parseQueryString(href);
        const error = params.error;
        if (error) {
            if (typeof callback === "function") {
                callback(error, params.error_description);
            }
        }
    },
    toLogin() {
        location.href = conf.getFrontEndUrl() + "/index.html";
    },

    /**
     * export to csv util
     * @param {string} url request this url to export
     * @param {string} filename csv file name
     * @param {DomElement} exportBtn export button dom element
     * @param {string} stateAttr reactjs state attribute
     */
    exportToCsv(url, filename, exportBtn, stateAttr="exportBtnEnabled") {
        if (navigator.userAgent.indexOf("Trident") > 0 || navigator.userAgent.indexOf("Edge") > 0) {
            this.searchParams.authorization = "Bearer " + localStorage.getItem("access_token_tc");
            window.open(url + '&tcode=' + localStorage.getItem("tcode"));
        } else {
            document.body.style.cursor = "progress";
            this.setState({
                exportBtnEnabled: false
            });
            axios.get(url)
                .then((result) => {
                    const link = exportBtn || document.getElementById("exportLink"),
                        str = decodeURIComponent("%ef%bb%bf") + result.data,
                        windowUrl = window.URL || window.webkitURL,
                        blob = new Blob([str], { type: "text/csv;charset=UTF-8" }),
                        url = windowUrl.createObjectURL(blob);
                    link.href = url;
                    link.download = filename;
                    link.click();
                    windowUrl.revokeObjectURL(url);
                    this.setState({
                        [stateAttr]: true
                    });
                    document.body.style.cursor = "default";
                }, (error) => {
                    util.showErrorMessage(error);
                    this.setState({
                        [stateAttr]: true
                    });
                    document.body.style.cursor = "default";
                });
        }
    },

    toggleStatus(status) {
        const up = status.toUpperCase();
        switch (up) {
        case "ACTIVE":
            return "INACTIVE";
        case "INACTIVE":
            return "ACTIVE";
        default:
            return null;
        }
    },
};

export default util;
