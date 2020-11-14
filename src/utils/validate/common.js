const validateRules = {
  phone (rule, value, callback) {
        if (!(/^1[3456789]\d{9}$/.test(value)) && !/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value)) {
            callback(new Error('联系电话格式错误'))
        } else {
            callback()
        }
    },
    loginName (rule, value, callback) {
        // 字母、数字、下划线组成，字母开头，4-20位
        const loginNameReg = /^[a-zA-z]\w{3,20}$/
        if (!loginNameReg.test(value)) {
            callback(new Error('必须以字母开头，长度为4-20位,由字母、数字、下划线组成'))
        } else {
            callback()
        }
    },
    email (rule, value, callback) {
        const emailReg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
        if (!emailReg.test(value)) {
            callback(new Error('邮箱地址格式错误'))
        } else {
            callback()
        }
    }
}
export default validateRules
