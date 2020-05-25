export const inputRules = {
    username,
    password,
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
    return { max: val, message: `최대 ${val}자 이하여야 합니다.` }
}

function username() {
    return [ required(), email() ]
}

function password() {
    return [ required(), min(8), max(50) ]
}