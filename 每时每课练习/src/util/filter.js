/**
 *  序列化时间
 * @param {String} val 时间戳 
 * @param {String} format 格式化类型
 */
const fomartTime = (val, format) => {
	// console.log(val+'=='+format);
    let date = new Date(val * 1000);
    let y = date.getFullYear();
    let m = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    let result = "";
    if (format == undefined) {
        result = `${y}-${m}-${d} ${h}:${min}:${s}`
    }
    if (format == "yyyy-MM-dd hh:mm") {
        result = `${y}-${m}-${d} ${h}:${min}`
    }
    if (format == "yyyy.MM.dd hh:mm") {
        result = `${y}.${m}.${d} ${h}:${min}`
    }
    if (format == "yyyy-MM-dd hh:mm:ss") {
        result = `${y}-${m}-${d} ${h}:${min}:${s}`
    }
    if (format == 'MM月dd日 hh:mm') {
        result = `${m}月${d}日 ${h}:${min}`
    }
    if (format == 'yyyy-MM-dd') {
        result = `${y}-${m}-${d}`
    }
    if (format == "yyyy.MM.dd") {
        result = `${y}.${m}.${d}`
    }
    if (format == 'hh:mm') {
        result = `${h}:${min}`
    }
    if (format == 'MM/dd') {
        result = `${m}/${d}`
    }
    if(format=='MM/dd hh:mm:ss')
    {
    	result = `${m}/${d} ${h}:${min}:${s}`
    }
    return result;
}
/**
 * 格式化价格
 * @param {Number} 价格 
 * @param {Number} toFix 保留位数
 */
const toFixPrice = (val, toFix = 2) => {
    let price = 0
    if (val) {
        if (toFix == 2) {
            price = (val / 100).toFixed(2)
        }
        if (toFix == 1) {
            price = (val / 100).toFixed(1)
        }
        if (toFix == 0) {
            price = (val / 100)
        }
    }
    return price
}
// 倒计时
const timeMeter = (t, type = 1) => {
    let time = Number(t);
    let m = time / 60 < 10 ? '0' + parseInt(time / 60) : parseInt(time / 60);
    let s = time % 60 < 10 ? '0' + time % 60 : time % 60;
    if (type == 1) {
        return m + ':' + s;
    } else if (type == 2) {
        return m + '分' + s + '秒';
    }

}
export {
    fomartTime,
    toFixPrice,
	timeMeter
}