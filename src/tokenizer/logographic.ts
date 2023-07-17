import { tokenizeNGram } from './ngram'

// single character words that are often used in Japanese and Chinese:
const SINGLE_CHARACTER_WORDS = {
  zh: new Set(
    '人火水木金土日月年時车雨马鱼米花鸟山川空星雪夜早海石风云狗猫心手目口足果实芽叶虫肉皮革羽毛盘茶糕蔬孤王庭园炭热灰照煽爆灼锻铸锅镜镰锁钟钩钉锤矛枪剑鞭弹箭弓柱盾索棹笼贬藏萨玫葛莲草苗麦弱荒肥茂柏胡柚梨荞椿藤牡蒲萩菊菱兰苔松竹梅槲枫樱桂橙柠林楠桦榛橡棕榈槽樋檀栏梳榄榴柘柿桶樵柜橱桥樽桌桨槌树计数算电线点形分秒开终入出机记存持量种位次值配列意理调式系定检条置类状型取合构用制法变关场通品指抽选号示还卖买运力间格报解者比试追付受求安界体共部能程表参设备信增减速前后新旧态面代费适集扱进止留范层初最反送交统应判'.split(
      '',
    ),
  ),
  ja: new Set(
    '人火水木金土日月年時車雨馬魚米花鳥山川空星雪夜朝海石風雲犬猫心手目口足果実芽葉虫肉皮革羽毛皿茶菓蔬孤王庭園炭熱灰照煽爆灼鍛錬鋳鍋鏡鎌錠鐘鉤釘鎚矛槍剣鞭弾矢弓杭盾綱棹篭蔑蔵薩薔薇葛蓮草苗麦若荒肥茂莫胡柚梨蕎椿藤葵菖蒲萩菊菱蘭苔松竹梅樫栞楓桜橿橙檸檬林楠樺槇榛橡椛棕櫨槙樋檀欄櫛檳榔柘榊檎柿栃橘樅槲樟椹檜槐榉檠椴榿桂檮椀柞樵櫑檻柾櫂樌樴槎樹計数算電線点形分秒開終入出機記存持量種位次値配列意理調式系定検条置類状型取合構用制法変関場通品指抽選番示返売買運力間格報解者比試追付受求安界体共部能程表参設備信増減速前後新古態面代費適集扱進止留範層初最反送交統応判'.split(
      '',
    ),
  ),
}

export const tokenize_logographic =
  (language: 'ja' | 'zh') =>
  (text: string): Array<string> =>
    // according to: https://www.eajournals.org/wp-content/uploads/Word-length-distribution-of-Japanese-dialects.pdf
    // the mean word length in Japanese is between 2 and 3 characters; this assumes that a
    // multigram of n-grams with a width of 2 and 3 characters and a sliding window of 1 per step
    // is sufficient to detect Japanese words

    // the same rule applies for Chinese, according to: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6254471/#:~:text=According%20to%20the%20Chinese%20Lexicon,is%20reduced%20relative%20to%20English.
    tokenizeNGram(text, [1, 2, 3], SINGLE_CHARACTER_WORDS[language])
