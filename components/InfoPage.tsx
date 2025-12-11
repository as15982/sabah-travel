
import React, { useState } from 'react';
import { Phone, Plug, Banknote, FileText, Car, User, Heart, Sun, AlertTriangle, Check, Plus, Trash2 } from 'lucide-react';

interface InfoCardProps {
  icon: React.ReactElement;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, children, className = "" }) => (
  <div className={`bg-white/90 backdrop-blur-sm p-5 rounded-[24px] shadow-card border border-white/50 ${className}`}>
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-gray-100 text-sabah-dark rounded-full">{React.cloneElement(icon, { size: 20 } as any)}</div>
      <h3 className="font-bold text-sabah-dark">{title}</h3>
    </div>
    <div className="text-sm text-gray-600 leading-relaxed font-sans space-y-2">
      {children}
    </div>
  </div>
);

interface ChecklistItemProps {
  item: { id: number, text: string, checked: boolean };
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ item, onToggle, onDelete }) => (
    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:border-sabah-blue/30 group">
        <button 
            onClick={() => onToggle(item.id)}
            className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
            ${item.checked ? 'bg-sabah-green border-sabah-green text-white' : 'bg-transparent border-gray-300'}`}
        >
            {item.checked && <Check size={14} strokeWidth={3} />}
        </button>
        <span className={`text-sm flex-1 ${item.checked ? 'text-gray-400 line-through' : 'text-sabah-dark'}`}>
            {item.text}
        </span>
        <button onClick={() => onDelete(item.id)} className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 size={16} />
        </button>
    </div>
);

const InfoPage: React.FC = () => {
    // Initial checklist state
    const [checklist, setChecklist] = useState([
        { id: 1, text: "護照 (效期 > 6個月)", checked: false },
        { id: 2, text: "完成 MDAC 電子入境卡填寫", checked: false },
        { id: 3, text: "機票電子檔存手機", checked: false },
        { id: 4, text: "萬用轉接頭 (英規三孔)", checked: false },
        { id: 5, text: "Grab App 下載並綁卡", checked: false },
        { id: 6, text: "台幣現金 (約 NT$ 10,000 - 12,000)", checked: false },
        { id: 7, text: "腸胃藥 / 暈船藥 / 防蚊液", checked: false },
    ]);
    const [newItemText, setNewItemText] = useState("");

    const toggleItem = (id: number) => {
        setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    };

    const addItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemText.trim()) return;
        setChecklist(prev => [...prev, { id: Date.now(), text: newItemText, checked: false }]);
        setNewItemText("");
    };

    const deleteItem = (id: number) => {
        setChecklist(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="px-6 pt-safe pb-24 animate-fade-in space-y-4">
            <h2 className="text-3xl font-serif font-bold text-sabah-dark mb-6 mt-6">旅遊資訊</h2>

            {/* 1. Entry & Visa */}
            <InfoCard icon={<FileText className="text-sabah-blue" />} title="1. 入境與簽證 (必辦！)">
                <p><strong className="text-sabah-dark">電子入境卡 (MDAC)：</strong> 雖免簽但強制填寫。</p>
                <ul className="list-disc pl-4 space-y-1">
                    <li><strong className="text-gray-500">時間：</strong> 抵達前 3天內 (含當日)。</li>
                    <li><strong className="text-gray-500">方式：</strong> 填寫後檢查 Email，截圖備查。</li>
                    <li><strong className="text-gray-500">護照：</strong> 須有 6個月以上 效期。</li>
                    <li><strong className="text-gray-500">機票：</strong> 建議存回程機票電子檔。</li>
                </ul>
            </InfoCard>

            {/* 2. Currency */}
            <InfoCard icon={<Banknote className="text-sabah-yellow" />} title="2. 貨幣與換匯">
                <p><strong className="text-sabah-dark">貨幣：</strong> 馬來西亞令吉 (MYR, RM)。</p>
                <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 my-2">
                    <h4 className="font-bold text-yellow-700 text-xs mb-1">換匯攻略</h4>
                    <p className="text-xs text-yellow-800">
                        ❌ <span className="opacity-70">台灣：匯率差，不建議。</span><br/>
                        ⚠️ <span className="opacity-70">機場：僅換小額 (車資/宵夜)。</span><br/>
                        ✅ <strong>市區：推薦 Wisma Merdeka，匯率最佳。</strong>
                    </p>
                </div>
                <p><strong className="text-sabah-dark">支付：</strong> 茶室/夜市用現金；Grab/百貨可刷卡。</p>
            </InfoCard>

            {/* 3. Voltage */}
            <InfoCard icon={<Plug className="text-blue-500" />} title="3. 電壓與網路">
                <p className="flex items-center gap-2">
                    <strong className="text-sabah-dark">插座：</strong> 
                    英規三孔 (Type G) 
                    <span className="bg-gray-200 text-[10px] px-1.5 rounded">🔌</span>
                </p>
                <p className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                    ⚠️ 台灣插頭無法直接插入，務必攜帶萬用轉接頭。
                </p>
                <p><strong className="text-sabah-dark">電壓：</strong> 220V-240V (手機筆電無需變壓器)。</p>
                <p><strong className="text-sabah-dark">網卡：</strong> 推薦 Digi 或 Celcom。</p>
            </InfoCard>

            {/* 4. Transport */}
            <InfoCard icon={<Car className="text-green-600" />} title="4. 交通移動">
                <p><strong className="text-sabah-dark">App：</strong> 必載 <strong>Grab</strong> (綁定信用卡)。</p>
                <p className="text-xs text-gray-500">亞庇計程車多不跳錶，Grab 價格透明且便宜。</p>
                <p><strong className="text-sabah-dark">路況：</strong> 17:00-19:00 市區易塞車。</p>
                <p><strong className="text-sabah-dark">行人：</strong> 車速快，過馬路請舉手示意。</p>
            </InfoCard>

            {/* 5. Culture */}
            <InfoCard icon={<User className="text-purple-500" />} title="5. 穿著與文化禮儀">
                <p><strong className="text-sabah-dark">清真寺：</strong> 嚴禁暴露 (不可露肩/腿/肚)。女性需包頭巾 (現場可租袍)。</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                     <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <span className="block font-bold text-xs mb-1">右手原則</span>
                        <span className="text-[10px]">遞東西/握手/進食</span>
                     </div>
                     <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <span className="block font-bold text-xs mb-1">指人方式</span>
                        <span className="text-[10px]">用「大拇指」示意</span>
                     </div>
                </div>
            </InfoCard>

            {/* 6. Health */}
            <InfoCard icon={<Heart className="text-pink-500" />} title="6. 衛生與健康">
                <p>🚰 自來水 <strong>不可生飲</strong>。</p>
                <p><strong className="text-sabah-dark">藥品：</strong> 腸胃藥、止痛藥、暈船藥。</p>
                <p><strong className="text-sabah-dark">如廁：</strong> 請隨身攜帶面紙 (公廁多為水沖式)。</p>
            </InfoCard>

            {/* 7. Itinerary Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-[24px] border border-blue-100 shadow-sm space-y-4">
                <h3 className="font-bold text-sabah-blue flex items-center gap-2">
                    <Sun size={20} /> 行程特別叮嚀
                </h3>
                
                <div>
                    <h4 className="font-bold text-sabah-blue text-sm mb-1">🏝️ 跳島玩水</h4>
                    <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                        <li>勤補防曬 (紫外線強)。</li>
                        <li>自備速乾毛巾、防水袋。</li>
                        <li>小心水母、勿觸碰珊瑚。</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-green-700 text-sm mb-1">🐒 雨林生態 (長鼻猴/螢火蟲)</h4>
                    <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                        <li><strong>防蚊：</strong> 穿薄長袖並噴強效防蚊液。</li>
                        <li><strong>螢火蟲：</strong> 嚴禁閃光燈 📸，手機調最暗。</li>
                    </ul>
                </div>
            </div>

            {/* 8. Customs Table */}
            <div className="bg-red-50 p-5 rounded-[24px] border border-red-100">
                <div className="flex items-center gap-2 mb-3 text-red-600">
                    <AlertTriangle size={20} />
                    <h3 className="font-bold">台灣入境海關規定 (回程必看)</h3>
                </div>
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="border-b border-red-200 text-red-800">
                            <th className="py-2 font-bold w-12">類別</th>
                            <th className="py-2 font-bold">規定與備註</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        <tr className="border-b border-red-100">
                            <td className="py-3 font-bold align-top">肉類</td>
                            <td className="py-3 align-top">
                                <span className="block text-red-600 font-bold">❌ 嚴禁攜帶</span>
                                <span className="opacity-80">含肉塊泡麵、肉乾、肉鬆。</span><br/>
                                <span className="text-green-600">✅ 純藥材湯/粉包 (無油/肉) 可。</span>
                            </td>
                        </tr>
                        <tr className="border-b border-red-100">
                            <td className="py-3 font-bold align-top">水果</td>
                            <td className="py-3 align-top">
                                <span className="block text-red-600 font-bold">❌ 嚴禁攜帶</span>
                                <span className="opacity-80">新鮮榴槤、山竹。</span><br/>
                                <span className="text-green-600">✅ 果乾、加工糖果可。</span>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-3 font-bold align-top">現金</td>
                            <td className="py-3 align-top">
                                限台幣10萬、美金1萬等值。
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 9. Interactive Checklist */}
            <div className="bg-sabah-dark text-white p-5 rounded-[24px] shadow-lg">
                <h3 className="font-bold font-serif text-lg mb-4 flex items-center gap-2">
                    <Check size={20} className="text-sabah-green" />
                    出發前最後檢查 List
                </h3>

                <div className="space-y-2 mb-4">
                    {checklist.map(item => (
                        <ChecklistItem 
                            key={item.id} 
                            item={item} 
                            onToggle={toggleItem} 
                            onDelete={deleteItem}
                        />
                    ))}
                </div>

                <form onSubmit={addItem} className="flex gap-2">
                    <input 
                        type="text" 
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder="新增檢查項目..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-sabah-blue"
                    />
                    <button type="submit" className="bg-sabah-blue text-white p-3 rounded-xl hover:bg-blue-600 transition-colors">
                        <Plus size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InfoPage;
