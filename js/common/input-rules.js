export const inputRules = {
    username,
    nickname,
    password,
    passwordRe,
}

function required() {
    return { required: true, message: '필수 입력사항입니다.' }
}

function email() {
    return { type: 'email', message: '이메일 형식이어야 합니다.' }
}

function min(val) {
    return { min: val, message: `최소 ${val}자 이상이어야 합니다.` }
}

function max(val) {
    return { max: val, message: `최대 ${val}글자 입니다.` }
}

const equalPassword = ({ getFieldValue }) => ({
    validator(rule, value) {
        if (!value || getFieldValue('password') == value) {
            return Promise.resolve()
        }
        return Promise.reject('두 비밀번호는 같아야 합니다.')
    }
})

const noWhitespace = () => ({
    validator(rule, value) {
        if (!value || value.indexOf(' ') >= 0) {
            return Promise.reject('공백은 사용할 수 없습니다.')
        }
        return Promise.resolve()
    }
})


function username() {
    return [ required(), email(), max(200), noWhitespace ]
}

function nickname() {
    return [ required(), max(9), noWhitespace ]
}

function password() {
    return [ required(), min(8), max(50) ]
}

function passwordRe() {
    return [ required(), min(8), max(50), equalPassword ]
}