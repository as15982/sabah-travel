

import { DayPlan, Expense, ShoppingLocation, ShoppingItem } from './types';

// Coordinates for Sabah locations based on the itinerary
export const LOCATIONS = {
  BKI_AIRPORT: { lat: 5.9375, lng: 116.0510, name: "亞庇國際機場 (BKI)", url: "https://maps.app.goo.gl/ePJZ5U5xeFCmF2hU8" },
  JESSELTON_QUAY: { lat: 5.9904, lng: 116.0798, name: "Jesselton Quay (JQ)", url: "https://maps.app.goo.gl/3R1xZLhLTuicD3GB6" },
  BORENOS_CHICKEN: { lat: 5.9760, lng: 116.0738, name: "Borenos Fried Chicken", url: "https://maps.app.goo.gl/TxwxbFrYLVCmYscd8" },
  FOOK_YUEN_GAYA: { lat: 5.9845, lng: 116.0775, name: "富源茶餐廳 Fook Yuen", url: "https://maps.app.goo.gl/EuUbbkmhpq9Sqvrk9" },
  YEE_FUNG_LAKSA: { lat: 5.9830, lng: 116.0770, name: "怡豐茶室 Yee Fung Laksa", url: "https://maps.app.goo.gl/WnxZrPhzcoAmS2GNA" },
  WISMA_MERDEKA: { lat: 5.9856, lng: 116.0777, name: "Wisma Merdeka", url: "https://maps.app.goo.gl/Z1wmwJvYJyEGGrAM9" },
  JESSELTON_POINT: { lat: 5.9890, lng: 116.0780, name: "Jesselton Point 碼頭", url: "https://maps.app.goo.gl/V9jC4SENVnXqVkgd7" },
  MANUKAN_ISLAND: { lat: 5.9644, lng: 116.0076, name: "Manukan 馬努干島", url: "https://maps.app.goo.gl/2YudfdqDXmGzBn5H6" },
  SAPI_ISLAND: { lat: 5.9606, lng: 116.0048, name: "Sapi 沙比島", url: "https://maps.app.goo.gl/EepQ76LKkaCKMedr7" },
  YU_KEE_BAK_KUT_TEH: { lat: 5.9840, lng: 116.0772, name: "佑記肉骨茶 Yu Kee", url: "https://maps.app.goo.gl/91JKY3SXBkZMh5KP6" },
  SIN_KEE_BAK_KUT_TEH: { lat: 5.9825, lng: 116.0770, name: "新記肉骨茶 Sin Kee", url: "https://maps.app.goo.gl/aAfNCokREo4Ef5PCA" },
  API_API_NIGHT_MARKET: { lat: 5.9835, lng: 116.0772, name: "加雅街夜市", url: "https://maps.app.goo.gl/XAuWddgRy8R4Qoj69" },
  WOO_CAFE: { lat: 5.9818, lng: 116.0785, name: "Woo! Cafe", url: "https://maps.app.goo.gl/XS1iXNaWkPyEPGcy7" },
  GUANS_KOPITIAM: { lat: 5.9835, lng: 116.0775, name: "源茶室 Guan's Kopitiam", url: "https://maps.app.goo.gl/KNiTh3YnwaHwHHy18" },
  UMS_MOSQUE: { lat: 6.0367, lng: 116.1186, name: "沙巴大學粉紅清真寺", url: "https://maps.app.goo.gl/LpWEkTrs3vzVogNy8" },
  JIA_XIANG_LINTAS: { lat: 5.9490, lng: 116.0920, name: "家香生肉麵", url: "https://maps.app.goo.gl/dH28jaQhk65kTVbc6" },
  IMAGO_MALL: { lat: 5.9705, lng: 116.0667, name: "Imago Shopping Mall", url: "https://maps.app.goo.gl/Xaix69z83tSxYWX79" },
  TANJUNG_ARU_BEACH: { lat: 5.9482, lng: 116.0447, name: "丹絨亞路海灘 Beach 2", url: "https://maps.app.goo.gl/bDrPDVcMoYZ49HvJA" },
  WELCOME_SEAFOOD: { lat: 5.9765, lng: 116.0740, name: "大茄來海鮮", url: "https://maps.app.goo.gl/yhW1Uk42XVnLD8oQ9" },
  KAMA_SPA: { lat: 5.9815, lng: 116.0782, name: "Kama'A Spa", url: "https://maps.app.goo.gl/Mxi3rzqiDZf4rFFCA" }
};

export const INITIAL_ITINERARY: DayPlan[] = [
  {
    date: '2026-01-09',
    weatherTemp: 27,
    weatherCondition: 'Cloudy',
    bgImage: 'https://i.pinimg.com/736x/a4/ae/3f/a4ae3f8d0c49e9cbf2e725a42e6d24ba.jpg', // D1
    flight: {
      departureTime: '19:15',
      departureCode: 'TPE',
      departureAirport: '台灣桃園國際機場 ｜T1航廈',
      arrivalTime: '22:50',
      arrivalCode: 'BKI',
      arrivalAirport: '哥打京那巴魯國際機場｜T1航廈',
      airline: '馬來西亞亞洲航空公司 AK1511',
      flightNumber: 'AK1511',
      aircraft: '經濟艙 空中巴士 A320-212'
    },
    items: [
      {
        id: '1-1',
        time: '22:30',
        duration: 40,
        activity: '抵達亞庇國際機場 (BKI)',
        location: 'Kota Kinabalu International Airport',
        coords: LOCATIONS.BKI_AIRPORT,
        type: 'transport',
        travelTime: 'Grab 20分'
      },
      {
        id: '1-2',
        time: '23:30',
        duration: 20,
        activity: '抵達住宿 Jesselton Quay (JQ)',
        location: 'Jesselton Quay, Jalan Tun Fuad Stephens',
        coords: LOCATIONS.JESSELTON_QUAY,
        type: 'relax',
        travelTime: '整理行李'
      },
      {
        id: '1-3',
        time: '23:50',
        duration: 60,
        activity: '宵夜 (二選一)',
        location: 'Swipe to view options',
        coords: LOCATIONS.BORENOS_CHICKEN,
        type: 'food',
        options: [
          {
            activity: 'Borenos Fried Chicken',
            location: 'Lot G23, Kompleks Asia City',
            coords: LOCATIONS.BORENOS_CHICKEN,
            notes: '在地好吃炸雞，開到半夜',
            imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=500&auto=format&fit=crop'
          },
          {
            activity: '富源茶餐廳 Fook Yuen',
            location: '53, Jalan Gaya',
            coords: LOCATIONS.FOOK_YUEN_GAYA,
            notes: '咖椰吐司、拉茶，開到很晚',
            imageUrl: 'https://images.unsplash.com/photo-1589301760588-441b6f5e71a9?q=80&w=500&auto=format&fit=crop'
          }
        ]
      }
    ]
  },
  {
    date: '2026-01-10',
    weatherTemp: 31,
    weatherCondition: 'Sunny',
    bgImage: 'https://i.pinimg.com/1200x/39/b4/aa/39b4aa96ca7fe7de41f28623af1eaf8b.jpg', // D2
    items: [
      {
        id: '2-0',
        time: '09:00',
        duration: 0,
        activity: '從住宿出發',
        location: 'Jesselton Quay (JQ)',
        coords: LOCATIONS.JESSELTON_QUAY,
        type: 'transport',
        travelTime: 'Grab 15分'
      },
      {
        id: '2-1',
        time: '09:15',
        duration: 45,
        activity: '早餐：怡豐茶室 Yee Fung Laksa',
        location: '127, Jalan Gaya',
        coords: LOCATIONS.YEE_FUNG_LAKSA,
        type: 'food',
        notes: '必點：叻沙 Laksa、沙煲雞飯',
        imageUrl: 'https://images.unsplash.com/photo-1632204655513-3392e2124508?q=80&w=500&auto=format&fit=crop', // Laksa
        travelTime: '步行 5分'
      },
      {
        id: '2-2',
        time: '10:00',
        duration: 30,
        activity: '換錢：Wisma Merdeka',
        location: 'Wisma Merdeka, Jalan Tun Razak',
        coords: LOCATIONS.WISMA_MERDEKA,
        type: 'activity',
        notes: '匯率最好，換完直接走去旁邊碼頭',
        travelTime: '步行 5分'
      },
      {
        id: '2-3',
        time: '10:30',
        duration: 30,
        activity: '出海：Jesselton Point 碼頭',
        location: 'Jesselton Point Ferry Terminal',
        coords: LOCATIONS.JESSELTON_POINT,
        type: 'transport',
        notes: '購票：Two Islands - Sapi + Manukan',
        travelTime: '船程 20分'
      },
      {
        id: '2-4a',
        time: '11:00',
        duration: 120,
        activity: '馬努干島 Manukan Island',
        location: 'Tunku Abdul Rahman Park',
        coords: LOCATIONS.MANUKAN_ISLAND,
        type: 'activity',
        notes: '享受陽光沙灘',
        travelTime: '換島船程'
      },
      {
        id: '2-4b',
        time: '13:00',
        duration: 120,
        activity: '沙比島 Sapi Island',
        location: 'Tunku Abdul Rahman Park',
        coords: LOCATIONS.SAPI_ISLAND,
        type: 'activity',
        notes: '水質較清澈，適合浮潛',
        travelTime: '船程返回'
      },
      {
        id: '2-5',
        time: '19:00',
        duration: 75,
        activity: '晚餐：肉骨茶 (二選一)',
        location: 'Swipe to view options',
        coords: LOCATIONS.YU_KEE_BAK_KUT_TEH,
        type: 'food',
        options: [
           {
            activity: '佑記肉骨茶 Yu Kee',
            location: '7, Jalan Gaya',
            coords: LOCATIONS.YU_KEE_BAK_KUT_TEH,
            notes: '藥膳味重，碗裝',
            imageUrl: 'https://images.unsplash.com/photo-1543363363-b8cf4b306b6f?q=80&w=500&auto=format&fit=crop'
          },
          {
            activity: '新記肉骨茶 Sin Kee',
            location: '26, Jalan Pantai',
            coords: LOCATIONS.SIN_KEE_BAK_KUT_TEH,
            notes: '湯頭濃郁，砂鍋裝',
            imageUrl: 'https://images.unsplash.com/photo-1627916508000-0df9a7978e5f?q=80&w=500&auto=format&fit=crop'
          }
        ],
        travelTime: '步行 3分'
      },
      {
        id: '2-6',
        time: '20:15',
        duration: 60,
        activity: '逛街：加雅街夜市',
        location: 'Api-Api Night Market',
        coords: LOCATIONS.API_API_NIGHT_MARKET,
        type: 'activity',
        notes: '週五週六限定夜市'
      }
    ]
  },
  {
    date: '2026-01-11',
    weatherTemp: 29,
    weatherCondition: 'Cloudy',
    bgImage: 'https://i.pinimg.com/1200x/fd/d5/18/fdd5185cbab77d2e1abf50b54b1fc656.jpg', // D3
    items: [
      {
        id: '3-0',
        time: '10:30',
        duration: 0,
        activity: '從住宿出發',
        location: 'Jesselton Quay (JQ)',
        coords: LOCATIONS.JESSELTON_QUAY,
        type: 'transport',
        travelTime: 'Grab 15分'
      },
      {
        id: '3-1',
        time: '10:45',
        duration: 90,
        activity: '網美早午餐 (二選一)',
        location: 'Swipe to view options',
        coords: LOCATIONS.WOO_CAFE,
        type: 'food',
        options: [
          {
            activity: 'Woo! Cafe',
            location: '25, Lorong Dewan',
            coords: LOCATIONS.WOO_CAFE,
            notes: '植物系網美風，義大利麵、早午餐好吃',
            imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=500&auto=format&fit=crop'
          },
          {
            activity: 'Guan\'s Kopitiam',
            location: 'Jalan Gaya',
            coords: LOCATIONS.GUANS_KOPITIAM,
            notes: '有冷氣的復古風，推咖椰吐司、紅咖哩雞',
            imageUrl: 'https://images.unsplash.com/photo-1559403842-70b925b4be46?q=80&w=500&auto=format&fit=crop'
          }
        ],
        travelTime: '車程 90分'
      },
      {
        id: '3-2',
        time: '13:30',
        duration: 360,
        activity: '長鼻猴 & 螢火蟲之旅',
        location: 'Kawa Kawa / Weston (Pickup at JQ)',
        coords: LOCATIONS.JESSELTON_QUAY,
        type: 'activity',
        notes: '旅行社專車接送，記得帶防蚊液',
        travelTime: '車程 90分'
      },
      {
        id: '3-3',
        time: '21:30',
        duration: 60,
        activity: '宵夜 (視體力決定)',
        location: 'Jesselton Quay / 富源',
        coords: LOCATIONS.FOOK_YUEN_GAYA,
        type: 'food'
      }
    ]
  },
  {
    date: '2026-01-12',
    weatherTemp: 32,
    weatherCondition: 'Sunny',
    bgImage: 'https://i.pinimg.com/1200x/3d/2b/b9/3d2bb9a9e3ebc71f0b73692f93e19633.jpg', // D4
    items: [
      {
        id: '4-0',
        time: '10:40',
        duration: 0,
        activity: '從住宿出發',
        location: 'Jesselton Quay (JQ)',
        coords: LOCATIONS.JESSELTON_QUAY,
        type: 'transport',
        travelTime: 'Grab 20分'
      },
      {
        id: '4-1',
        time: '11:00',
        duration: 60,
        activity: '景點：沙巴大學粉紅清真寺',
        location: 'Jalan UMS (UMS Pink Mosque)',
        coords: LOCATIONS.UMS_MOSQUE,
        type: 'activity',
        notes: '記得穿著得體或租借長袍，粉紅牆面超好拍',
        travelTime: 'Grab 20分'
      },
      {
        id: '4-2',
        time: '12:30',
        duration: 60,
        activity: '午餐：家香生肉麵',
        location: 'Lintas Plaza',
        coords: LOCATIONS.JIA_XIANG_LINTAS,
        type: 'food',
        notes: '湯頭鮮甜，肉片滑嫩',
        imageUrl: 'https://images.unsplash.com/photo-1626809804863-7c85172088f1?q=80&w=500&auto=format&fit=crop',
        travelTime: 'Grab 15分'
      },
      {
        id: '4-3',
        time: '14:00',
        duration: 180,
        activity: '購物：Imago Shopping Mall',
        location: 'KK Times Square',
        coords: LOCATIONS.IMAGO_MALL,
        type: 'activity',
        notes: '買 Bata、Padini、超市伴手禮 (3小時)',
        travelTime: 'Grab 15分'
      },
      {
        id: '4-4',
        time: '17:30',
        duration: 90,
        activity: '夕陽：丹絨亞路海灘',
        location: 'Tanjung Aru Beach',
        coords: LOCATIONS.TANJUNG_ARU_BEACH,
        type: 'relax',
        notes: '世界三大夕陽之一，定位 Beach 2 為佳',
        travelTime: 'Grab 15分'
      },
      {
        id: '4-5',
        time: '19:30',
        duration: 90,
        activity: '晚餐：大茄來海鮮',
        location: 'Kompleks Asia City',
        coords: LOCATIONS.WELCOME_SEAFOOD,
        type: 'food',
        notes: '必點：濕奶油老虎蝦、鹹蛋黃炒蟹、桔子冰',
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500&auto=format&fit=crop', // Seafood
        travelTime: '步行 5分'
      },
      {
        id: '4-6',
        time: '21:30',
        duration: 30,
        activity: '按摩：Kama’ A Spa',
        location: '15, Jalan Dewan',
        coords: LOCATIONS.KAMA_SPA,
        type: 'relax',
        notes: '放鬆完回 JQ 打包行李'
      }
    ]
  },
  {
    date: '2026-01-13',
    weatherTemp: 26,
    weatherCondition: 'Rain',
    bgImage: 'https://i.pinimg.com/736x/7e/22/3f/7e223f12849b463bc9ce8caf19b59e53.jpg', // D5
    flight: {
      departureTime: '07:40',
      departureCode: 'BKI',
      departureAirport: '哥打京那巴魯國際機場｜T1航廈',
      arrivalTime: '10:55',
      arrivalCode: 'TPE',
      arrivalAirport: '台灣桃園國際機場｜T1航廈',
      airline: '馬來西亞亞洲航空公司 AK1510',
      flightNumber: 'AK1510',
      aircraft: '經濟艙 空中巴士 A320-212'
    },
    items: [
      {
        id: '5-1',
        time: '04:45',
        duration: 15,
        activity: '起床 & 退房',
        location: 'Jesselton Quay',
        coords: LOCATIONS.JESSELTON_QUAY,
        type: 'relax',
        travelTime: 'Grab 20分'
      },
      {
        id: '5-2',
        time: '05:00',
        duration: 0,
        activity: '出發前往亞庇機場',
        location: 'Kota Kinabalu International Airport',
        coords: LOCATIONS.BKI_AIRPORT,
        type: 'transport',
        notes: '叫 Grab，07:00 飛機起飛 ✈️ 回家'
      }
    ]
  }
];

export const INITIAL_EXPENSES: Expense[] = [];

export const INITIAL_SHOPPING_LOCATIONS: ShoppingLocation[] = [
  { 
    id: 'sl-1', 
    name: 'Wisma Merdeka', 
    description: '最佳換匯地點，也有賣紀念品', 
    type: '換匯 & 紀念品', 
    googleMapQuery: 'Wisma Merdeka Kota Kinabalu',
    imageUrl: 'https://images.unsplash.com/photo-1574902998399-56d11bd85721?q=80&w=500' // General Mall
  },
  { 
    id: 'sl-2', 
    name: 'Imago Shopping Mall', 
    description: '亞庇最大商場，必買 Padini, Bata, Fipper, Eureka', 
    type: '購物中心', 
    googleMapQuery: 'Imago Shopping Mall Kota Kinabalu',
    imageUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3d9f?q=80&w=500' // Mall Exterior/Interior
  },
  { 
    id: 'sl-3', 
    name: 'Gaya Street Market', 
    description: '週日市集 / 週五六夜市，手工藝品多', 
    type: '當地市集', 
    googleMapQuery: 'Gaya Street Kota Kinabalu',
    imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=500' // Market
  },
  { 
    id: 'sl-4', 
    name: 'Suria Sabah', 
    description: '位於海邊的購物中心，有無敵海景，超市好買', 
    type: '購物中心', 
    googleMapQuery: 'Suria Sabah Shopping Mall',
    imageUrl: 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=500' // Mall
  },
  { 
    id: 'sl-5', 
    name: 'KK Plaza', 
    description: '地下室超市便宜，適合買伴手禮', 
    type: '超市', 
    googleMapQuery: 'KK Plaza Kota Kinabalu',
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-b7e6012e6b17?q=80&w=500' // Supermarket
  }
];

export const INITIAL_SHOPPING_ITEMS: ShoppingItem[] = [
  {
    id: 'si-1',
    name: '沙巴紅茶 (Sabah Tea)',
    description: '神山有機栽種，味道單純不澀。推薦綠色包裝。',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=500',
    locationHint: '各大超市'
  },
  {
    id: 'si-2',
    name: '益和丹南咖啡',
    description: '沙巴最古老咖啡，必買「銀色包裝 Kopi O」，炭燒味香濃。',
    rating: 4,
    imageUrl: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=500',
    locationHint: '超市'
  },
  {
    id: 'si-3',
    name: 'Beryl\'s 巧克力',
    description: '國寶級巧克力，推薦提拉米蘇和榴槤口味。',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1511381978829-2c287a32d18b?q=80&w=500'
  },
  {
    id: 'si-4',
    name: 'Eureka 爆米花',
    description: '馬來西亞產地價約台灣6-7折。口味超多(番茄/酸奶洋蔥)。',
    rating: 5,
    locationHint: 'Imago Mall 專櫃',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=500'
  },
  {
    id: 'si-5',
    name: 'A1 肉骨茶包',
    description: '⚠️ 只能買純藥材粉/香料包！含豬肉成分禁帶回台(罰20萬)。',
    rating: 4,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=500'
  },
  {
    id: 'si-6',
    name: 'Kaya 咖椰醬',
    description: '如果愛上富源的吐司，買罐頭裝回家抹吐司。',
    rating: 3,
    imageUrl: 'https://images.unsplash.com/photo-1589301760588-441b6f5e71a9?q=80&w=500'
  },
  {
    id: 'si-7',
    name: 'Fipper 夾腳拖',
    description: '國民拖鞋(大象標誌)。橡膠材質好穿防滑，顏色繽紛。',
    rating: 5,
    priceEstimate: 'RM 20-40',
    locationHint: 'Imago Mall',
    imageUrl: 'https://images.unsplash.com/photo-1562124638-724e13052aaf?q=80&w=500'
  },
  {
    id: 'si-8',
    name: 'Padini (Vincci)',
    description: '國民快時尚。Vincci 鞋包非常便宜好看，涼鞋常不到台幣400。',
    rating: 4,
    locationHint: 'Imago Mall',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=500'
  },
  {
    id: 'si-9',
    name: 'Bata 鞋子',
    description: '市佔率高，價格比台灣便宜，穿起來很軟很舒服。',
    rating: 3,
    locationHint: 'Imago Mall',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500'
  },
  {
    id: 'si-10',
    name: '長鼻猴娃娃',
    description: '婆羅洲特有，鼻子大大醜萌，很有紀念價值。',
    rating: 4,
    imageUrl: 'https://images.unsplash.com/photo-1570414461014-429a4c58c1df?q=80&w=500'
  },
  {
    id: 'si-11',
    name: '沙巴手工藝品',
    description: '編織包、串珠，色彩鮮豔。',
    rating: 4,
    locationHint: '加雅街市集',
    imageUrl: 'https://images.unsplash.com/photo-1459416527563-3467614d9b62?q=80&w=500'
  },
  {
    id: 'si-12',
    name: 'The Art Attic 文創',
    description: '當地藝術家設計的明信片、T恤、磁鐵，質感好。',
    rating: 4,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=500'
  }
];