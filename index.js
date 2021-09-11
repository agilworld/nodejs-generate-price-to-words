const fs = require("fs")
const { kebabCase } = require("lodash")
const numeral = require("numeral")

numeral.register('locale', 'my', {
    delimiters: {
        thousands: '',
        decimal: ''
    },
    abbreviations: {
        thousand: 'Ribu',
        million: 'Juta',
        billion: 'Miliar',
        trillion: 'Triliun'
    },
    currency: {
        symbol: ''
    }
  });
  
numeral.locale('my')

const typePriceCase = [
    'di bawah',
    'di atas'
]
  
const dijualList = () => {
    let data = []
    typePriceCase.forEach(element => {
        getNumberingJual().forEach(number=>{
        let tail = numeral(number.value).format("0 a")
        let slugTitle = `${element} ${tail}`
        let slug = kebabCase(slugTitle)
        if( element=="di bawah" ) {    
            data.push({
                ...number,
                id:"dijual",
                type:element,
                start:"all", 
                end:number.value,
                label:tail,
                slugTitle:slugTitle,
                slug:slug
            })
        }

        if( element=="di atas" ) {    
            data.push({
                ...number,
                id:"dijual",
                type:element,
                start:number.value, 
                end:"all",
                label:tail,
                slugTitle:slugTitle,
                slug:slug
            })
        }

      })
    });
    data.push({
        label:"Custom Range"
    })
    return data
}

const disewaList = () => {
    let data = []
    typePriceCase.forEach(element => {
        getNumberingSewa().forEach(number=>{
            let tail = numeral(number.value).format("0 a")
            let slugTitle = `${element} ${tail}`
            let slug = kebabCase(slugTitle)
            // Harga Max
            if( element=="di bawah" ) {    
                data.push({
                    ...number,
                    id:"disewakan",
                    type:element,
                    start:"all", 
                    end:number.value,
                    label:tail,
                    slugTitle:slugTitle,
                    slug:slug
                })
            }
            // Harga min
            if( element=="di atas" ) {    
                data.push({
                    ...number,
                    id:"disewakan",
                    type:element,
                    start:number.value, 
                    end:"all",
                    label:tail,
                    slugTitle:slugTitle,
                    slug:slug
                })
            }

        })
    });
    data.push({
        label:"Custom Range"
    })
    return data
}
  
  
const getNumberingJual = () => {
    let d = 60
    let a = [...Array(d)].map((x, i)=>{ 
        i=i+1
        if(i<11) {
            return {
              value:i*100000000,
              key:i*100000000
            }
        } else {
            return {
              value:(i-10)*1000000000,
              key:(i-10)*1000000000,
            }
        }
    })
    return a
}
  
const getNumberingSewa = () => {
    let d = 60
    let a = [...Array(d)].map((x, i)=>{ 
        i=i+1
        if(i<11) {
            return {
              value:i*10000000,
              key:i*10000000
            }
        } else {
            return {
              value:(i-10)*100000000,
              key:(i-10)*100000000,
            }
        }
    })
    return a
}
  

const generateJsonData = () => {
    let promises = [
        dijualList(),
        disewaList()
    ]

    Promise.all(promises).then(values=>{
        values.forEach(value=>{
            createJsonFile(value, kebabCase(value[0].id) )
        })
    })
}
/* 
    Method to convert JSON format data into XML format
*/
const createJsonFile = (list, status) => {
    saveFile( JSON.stringify(list), status);
}

/* 
    Method to Update sitemap.xml file content
*/
const saveFile = (json, status) => {
    fs.writeFile(`price-${status}.json`, json, (err) => {
        if (err) {
            return console.log(err);
        }

        console.log(status);
    });
}

generateJsonData()