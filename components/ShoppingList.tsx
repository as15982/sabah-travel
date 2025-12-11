

import React, { useState } from 'react';
import { INITIAL_SHOPPING_LOCATIONS, INITIAL_SHOPPING_ITEMS } from '../constants';
import { ShoppingLocation, ShoppingItem } from '../types';
import { MapPin, Star, Plus, X, ShoppingBag, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import EditableImage from './EditableImage';

const ShoppingList: React.FC = () => {
  const [locations, setLocations] = useState<ShoppingLocation[]>(INITIAL_SHOPPING_LOCATIONS);
  const [items, setItems] = useState<ShoppingItem[]>(INITIAL_SHOPPING_ITEMS);
  // Replaced individual expansion with section expansion
  const [isLocationsExpanded, setIsLocationsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShoppingItem | null>(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Form states
  const [newLocName, setNewLocName] = useState('');
  const [newLocDesc, setNewLocDesc] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName) return;
    const newLoc: ShoppingLocation = {
      id: `loc-${Date.now()}`,
      name: newLocName,
      description: newLocDesc,
      type: '自訂',
      googleMapQuery: newLocName
    };
    setLocations([...locations, newLoc]);
    setIsAddingLocation(false);
    setNewLocName('');
    setNewLocDesc('');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;
    const newItem: ShoppingItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      description: newItemDesc,
      priceEstimate: newItemPrice,
      rating: 0
    };
    setItems([...items, newItem]);
    setIsAddingItem(false);
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice('');
  };

  const handleLocationImageChange = (id: string, newSrc: string) => {
    setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, imageUrl: newSrc } : loc));
  };

  const handleItemImageChange = (id: string, newSrc: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, imageUrl: newSrc } : item));
    // Also update selected item if it's open
    if (selectedItem && selectedItem.id === id) {
        setSelectedItem(prev => prev ? { ...prev, imageUrl: newSrc } : null);
    }
  };

  return (
    <div className="px-6 pt-safe pb-32 animate-fade-in relative">
      <h2 className="text-3xl font-serif font-bold text-sabah-dark mb-6 mt-6">購物清單</h2>
      
      {/* Warning Section */}
      <div className="bg-red-50/90 border border-red-100 rounded-[20px] p-5 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-red-600">
            <AlertTriangle size={20} className="fill-red-100" />
            <h3 className="font-bold text-sm">入境台灣注意事項 (非常重要！)</h3>
        </div>
        <div className="space-y-3">
            <div>
                <span className="text-xs font-bold text-red-500 block mb-0.5">肉類製品：嚴禁！</span>
                <p className="text-[10px] text-gray-600 leading-relaxed">
                    攜帶任何豬肉製品（肉乾、肉鬆、含肉的泡麵、含肉塊的肉骨茶包）。
                    雞肉鬆、魚肉鬆 如果有完整商業包裝通常可以，但為了避免麻煩，建議盡量避免帶肉類。
                </p>
            </div>
            <div>
                <span className="text-xs font-bold text-red-500 block mb-0.5">新鮮水果：不能帶！</span>
                <p className="text-[10px] text-gray-600 leading-relaxed">
                    榴槤、山竹都<span className="font-bold underline">不能</span>帶回台灣。只能在當地吃完，或是買加工過的（榴槤糖、榴槤巧克力、榴槤咖啡）。
                </p>
            </div>
        </div>
      </div>

      {/* Locations Section */}
      <section className="mb-10">
        <div 
            onClick={() => setIsLocationsExpanded(!isLocationsExpanded)}
            className="flex justify-between items-center mb-4 cursor-pointer active:opacity-70 transition-opacity select-none"
        >
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-sabah-dark flex items-center gap-2">
                    <MapPin size={18} className="text-sabah-blue" />
                    購物地點
                </h3>
                {isLocationsExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsAddingLocation(true);
                }}
                className="w-8 h-8 rounded-full bg-white text-sabah-blue border border-gray-100 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
                <Plus size={16} />
            </button>
        </div>
        
        {isLocationsExpanded && (
            <div className="flex flex-col gap-3 animate-fade-in">
                {locations.map(loc => (
                    <div 
                        key={loc.id}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-card border border-white/50 overflow-hidden"
                    >
                        <div className="p-4 flex justify-between gap-4">
                            <div className="flex flex-col justify-start flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                                    <h4 className="font-bold text-sabah-dark text-base">{loc.name}</h4>
                                    <span className="text-[10px] text-sabah-blue font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                                        {loc.type}
                                    </span>
                                </div>
                                
                                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                                    {loc.description}
                                </p>
                                
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.googleMapQuery)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 bg-sabah-dark text-white text-[10px] font-bold px-3 py-2 rounded-lg active:scale-95 transition-transform self-start"
                                >
                                    <MapPin size={12} />
                                    前往 Google Maps
                                </a>
                            </div>

                            <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm self-start">
                                <EditableImage 
                                    src={loc.imageUrl} 
                                    alt={loc.name}
                                    onImageChange={(src) => handleLocationImageChange(loc.id, src)}
                                    className="w-full h-full"
                                    placeholderIcon={<ShoppingBag size={20} />}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </section>

      {/* Must-Buy Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-serif font-bold text-sabah-dark flex items-center gap-2">
                <Star size={18} className="text-sabah-yellow" />
                必買清單
            </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
            {items.map(item => (
                <div 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-card border border-white/50 flex flex-col h-full cursor-pointer active:scale-[0.98] transition-transform"
                >
                    <div className="aspect-square bg-gray-100 rounded-xl mb-3 overflow-hidden border border-gray-100 relative">
                        <EditableImage 
                            src={item.imageUrl} 
                            alt={item.name}
                            onImageChange={(src) => handleItemImageChange(item.id, src)}
                            className="w-full h-full"
                            placeholderIcon={<ShoppingBag size={24} />}
                        />
                        {item.rating > 0 && (
                             <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm pointer-events-none">
                                <Star size={8} className="fill-sabah-yellow text-sabah-yellow" />
                                <span className="text-[8px] font-bold">{item.rating}</span>
                             </div>
                        )}
                    </div>
                    <h4 className="font-bold text-sabah-dark text-xs mb-1 line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 mb-2 leading-tight line-clamp-2 flex-grow">{item.description}</p>
                    {item.priceEstimate && (
                        <div className="text-[10px] font-bold text-sabah-blue bg-blue-50 px-2 py-1 rounded-md self-start">
                            {item.priceEstimate}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </section>

      {/* Floating Action Button (FAB) for Adding Items */}
      <button 
        onClick={() => setIsAddingItem(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-sabah-blue text-white rounded-full shadow-lg shadow-blue-400/40 flex items-center justify-center z-40 active:scale-90 transition-transform hover:brightness-110"
      >
        <Plus size={28} />
      </button>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div>
            <div className="bg-white rounded-[32px] p-6 w-full max-w-sm relative z-10 animate-[fadeIn_0.3s_ease-out] shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar">
                <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 z-20">
                    <X size={20} />
                </button>
                
                <div className="aspect-[4/3] rounded-2xl bg-gray-100 overflow-hidden mb-5 relative shrink-0">
                    <EditableImage 
                        src={selectedItem.imageUrl} 
                        alt={selectedItem.name}
                        onImageChange={(src) => handleItemImageChange(selectedItem.id, src)}
                        className="w-full h-full"
                        placeholderIcon={<ShoppingBag size={48} />}
                    />
                </div>

                <div className="flex items-start justify-between mb-2">
                    <h2 className="text-2xl font-serif font-bold text-sabah-dark leading-tight">{selectedItem.name}</h2>
                    {selectedItem.rating > 0 && (
                        <div className="flex items-center gap-1 bg-sabah-yellow/10 px-2 py-1 rounded-lg">
                            <Star size={14} className="fill-sabah-yellow text-sabah-yellow" />
                            <span className="text-xs font-bold text-sabah-dark">{selectedItem.rating}</span>
                        </div>
                    )}
                </div>

                {selectedItem.priceEstimate && (
                    <div className="text-sm font-bold text-sabah-blue bg-blue-50 px-3 py-1.5 rounded-lg self-start mb-4">
                        參考價格：{selectedItem.priceEstimate}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">特色介紹</h4>
                        <p className="text-sm text-gray-600 leading-relaxed font-sans">
                            {selectedItem.description}
                        </p>
                    </div>

                    {selectedItem.locationHint && (
                         <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">哪裡買</h4>
                            <div className="flex items-center gap-2 text-sm text-sabah-dark font-medium">
                                <MapPin size={16} className="text-sabah-orange" />
                                {selectedItem.locationHint}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Add Location Modal */}
      {isAddingLocation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddingLocation(false)}></div>
            <form onSubmit={handleAddLocation} className="bg-white rounded-[32px] p-6 w-full max-w-sm relative z-10 animate-fade-in">
                <h3 className="text-lg font-bold text-sabah-dark mb-4">新增購物地點</h3>
                <input 
                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl mb-3 text-sm outline-none focus:border-sabah-blue"
                    placeholder="地點名稱"
                    value={newLocName}
                    onChange={e => setNewLocName(e.target.value)}
                    required
                />
                <textarea 
                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl mb-4 text-sm outline-none focus:border-sabah-blue resize-none h-24"
                    placeholder="備註說明"
                    value={newLocDesc}
                    onChange={e => setNewLocDesc(e.target.value)}
                />
                <div className="flex gap-3">
                    <button type="button" onClick={() => setIsAddingLocation(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm">取消</button>
                    <button type="submit" className="flex-1 py-3 rounded-xl bg-sabah-blue text-white font-bold text-sm">新增</button>
                </div>
            </form>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddingItem(false)}></div>
            <form onSubmit={handleAddItem} className="bg-white rounded-[32px] p-6 w-full max-w-sm relative z-10 animate-fade-in">
                <h3 className="text-lg font-bold text-sabah-dark mb-4">新增必買商品</h3>
                <input 
                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl mb-3 text-sm outline-none focus:border-sabah-blue"
                    placeholder="商品名稱"
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    required
                />
                <input 
                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl mb-3 text-sm outline-none focus:border-sabah-blue"
                    placeholder="價格預估 (選填)"
                    value={newItemPrice}
                    onChange={e => setNewItemPrice(e.target.value)}
                />
                <textarea 
                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl mb-4 text-sm outline-none focus:border-sabah-blue resize-none h-24"
                    placeholder="備註說明"
                    value={newItemDesc}
                    onChange={e => setNewItemDesc(e.target.value)}
                />
                <div className="flex gap-3">
                    <button type="button" onClick={() => setIsAddingItem(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm">取消</button>
                    <button type="submit" className="flex-1 py-3 rounded-xl bg-sabah-blue text-white font-bold text-sm">新增</button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;