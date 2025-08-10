export function validatePhone(phone: string) {
    const pattern = /^1[3456789]\d{9}$/;
    if (!pattern.test(phone)) {
        alert("请输入正确的手机号码");
        return false;
    }
    return true;
};