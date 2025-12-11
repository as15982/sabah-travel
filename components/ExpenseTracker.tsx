

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Expense, EXCHANGE_RATE } from '../types';
import { Plus, Wallet, ShoppingBag, Coffee, Car, Home, ArrowRightLeft, CreditCard, Banknote, Users, Check, ArrowRight, Trash2 } from 'lucide-react';

interface ExpenseTrackerProps {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

const CategoryIcon = ({ cat, size = 18 }: { cat: string, size?: number }) => {
  switch (cat) {
    case 'food': return <Coffee size={size} />;
    case 'transport': return <Car size={size} />;
    case 'shopping': return <ShoppingBag size={size} />;
    case 'stay': return <Home size={size} />;
    default: return <Wallet size={size} />;
  }
};

const getCategoryName = (cat: string) => {
    switch (cat) {
        case 'food': return '餐飲';
        case 'transport': return '交通';
        case 'shopping': return '購物';
        case 'stay': return '住宿';
        default: return '其他';
    }
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ expenses, onAddExpense, onDeleteExpense }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Expense['category']>('food');
  const [payer, setPayer] = useState<'JIA' | 'KIA'>('JIA');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isSplit, setIsSplit] = useState(false);
  const [filterUser, setFilterUser] = useState<'JIA' | 'KIA' | null>(null);

  // Long press state
  const [deleteModeId, setDeleteModeId] = useState<string | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filter expenses based on user selection
  const filteredExpenses = useMemo(() => {
    if (!filterUser) return expenses;
    return expenses.filter(e => e.payer === filterUser);
  }, [expenses, filterUser]);

  const totalTWD = useMemo(() => filteredExpenses.reduce((sum, e) => sum + e.amountTWD, 0), [filteredExpenses]);
  const totalMYR = useMemo(() => filteredExpenses.reduce((sum, e) => sum + e.amountMYR, 0), [filteredExpenses]);

  // Split Calculation Logic
  const splitData = useMemo(() => {
    const splitExpenses = expenses.filter(e => e.isSplit);
    const totalSplitCost = splitExpenses.reduce((sum, e) => sum + e.amountTWD, 0);
    const jiaPaid = splitExpenses.filter(e => e.payer === 'JIA').reduce((sum, e) => sum + e.amountTWD, 0);
    
    // Each person should have paid half of the total split cost
    const sharePerPerson = totalSplitCost / 2;
    
    // If JIA paid more than share, KIA owes JIA.
    // Difference is (JiaPaid - Share)
    const diff = jiaPaid - sharePerPerson;
    
    return {
        totalSplitCost,
        debtor: diff > 0 ? 'KIA' : 'JIA',
        creditor: diff > 0 ? 'JIA' : 'KIA',
        amount: Math.abs(diff)
    };
  }, [expenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || !description) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      amountMYR: val,
      amountTWD: val * EXCHANGE_RATE,
      category,
      description,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      payer,
      paymentMethod,
      isSplit
    };

    onAddExpense(newExpense);
    setAmount('');
    setDescription('');
    setIsSplit(false); 
  };

  // Long press handlers
  const handleStartPress = (id: string) => {
    longPressTimerRef.current = setTimeout(() => {
      setDeleteModeId(id);
    }, 600);
  };

  const handleEndPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setDeleteModeId(null);
    if (deleteModeId) {
        window.addEventListener('click', handleClickOutside);
    }
    return () => {
        window.removeEventListener('click', handleClickOutside);
    }
  }, [deleteModeId]);

  const confirmDelete = (e: React.MouseEvent, id: string) => {
      e.stopPropagation(); // Prevent clearing mode immediately
      onDeleteExpense(id);
      setDeleteModeId(null);
  };

  return (
    <div className="font-sans h-full flex flex-col">
      {/* Sticky Top Cards */}
      <div className="sticky top-0 z-30 bg-sabah-bg/95 backdrop-blur-xl pt-safe px-6 pb-4 border-b border-gray-100/50 shadow-sm transition-all">
          <div className="flex overflow-x-auto gap-4 pb-1 -mx-2 px-2 snap-x no-scrollbar pt-2">
            
            {/* Total Expenditure Card */}
            <div className="min-w-[100%] snap-center bg-sabah-dark rounded-[32px] p-6 text-white shadow-xl shadow-gray-200 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-sabah-blue rounded-full blur-3xl opacity-20"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sabah-orange rounded-full blur-3xl opacity-10"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">總支出</h2>
                        {/* User Filters */}
                        <div className="flex gap-1.5">
                            <button 
                                onClick={() => setFilterUser(null)}
                                className={`h-8 px-3 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all
                                ${filterUser === null ? 'bg-white/20 border-white text-white' : 'bg-transparent border-gray-600 text-gray-400'}`}
                            >ALL</button>
                            <button 
                                onClick={() => setFilterUser('JIA')}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all
                                ${filterUser === 'JIA' ? 'bg-sabah-blue border-sabah-blue text-white' : 'bg-transparent border-gray-600 text-gray-400'}`}
                            >JIA</button>
                            <button 
                                onClick={() => setFilterUser('KIA')}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all
                                ${filterUser === 'KIA' ? 'bg-sabah-orange border-sabah-orange text-white' : 'bg-transparent border-gray-600 text-gray-400'}`}
                            >KIA</button>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-lg font-serif text-gray-400">NT$</span>
                        <span className="text-4xl font-sans font-bold tracking-tight">{totalTWD.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    
                    <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">馬幣 MYR</span>
                            <span className="font-mono text-xl font-medium text-sabah-yellow">RM {totalMYR.toLocaleString()}</span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/20"></div>
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">匯率估算</span>
                            <span className="font-mono text-xs">1 ≈ {EXCHANGE_RATE} TWD</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end mt-2 items-center gap-1 opacity-50 text-[10px]">
                    <span>向右滑動查看分帳</span> <ArrowRight size={10} />
                </div>
            </div>

            {/* Split Settlement Card */}
            <div className="min-w-[100%] snap-center bg-white rounded-[32px] p-6 text-sabah-dark shadow-xl shadow-gray-200 relative overflow-hidden border border-gray-100 flex flex-col justify-between">
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">分帳即時回饋</h2>
                        <div className="bg-sabah-green/10 text-sabah-green p-2 rounded-full">
                            <Users size={18} />
                        </div>
                    </div>

                    {splitData.amount < 1 ? (
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                                <Check size={24} />
                            </div>
                            <span className="font-bold text-lg text-gray-400">目前結清</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-2">
                            <div className="flex items-center gap-4 mb-2 w-full justify-between px-4">
                                <div className="text-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-4 mx-auto mb-1
                                        ${splitData.debtor === 'JIA' ? 'bg-sabah-blue text-white border-blue-200' : 'bg-sabah-orange text-white border-orange-200'}`}>
                                        {splitData.debtor}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400">需支付</span>
                                </div>
                                
                                <div className="flex-1 flex flex-col items-center">
                                    <span className="text-xs text-gray-400 mb-1">給予</span>
                                    <div className="h-[2px] w-full bg-gray-200 relative">
                                        <div className="absolute right-0 -top-1 w-2 h-2 bg-gray-300 rotate-45 transform origin-center border-t border-r border-gray-300"></div>
                                    </div>
                                    <span className="font-mono font-bold text-xl mt-1 text-sabah-dark">NT$ {splitData.amount.toFixed(0)}</span>
                                </div>

                                <div className="text-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-4 mx-auto mb-1
                                        ${splitData.creditor === 'JIA' ? 'bg-sabah-blue text-white border-blue-200' : 'bg-sabah-orange text-white border-orange-200'}`}>
                                        {splitData.creditor}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400">收款</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 bg-gray-50 px-3 py-1 rounded-full">
                                總分帳支出: NT$ {splitData.totalSplitCost.toFixed(0)}
                            </p>
                        </div>
                    )}
                </div>
            </div>
          </div>
      </div>

      <div className="flex-1 px-6 pb-24 pt-4">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[24px] p-5 shadow-card mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sabah-dark font-serif font-bold text-lg">新增紀錄</h3>
                <div className="bg-sabah-bg px-2 py-1 rounded-md">
                    <span className="text-[10px] font-bold text-sabah-blue">自動換算</span>
                </div>
            </div>

            <div className="bg-sabah-bg rounded-2xl p-4 mb-4 flex items-center gap-4">
                <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">MYR 金額</label>
                    <div className="flex items-baseline gap-1">
                        <span className="text-sabah-dark font-bold">RM</span>
                        <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full bg-transparent text-2xl font-bold text-sabah-dark outline-none placeholder-gray-300"
                        />
                    </div>
                </div>
                <ArrowRightLeft size={16} className="text-gray-300" />
                <div className="flex-1 text-right">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">台幣約</label>
                    <span className="text-xl font-bold text-sabah-blue">
                        {amount ? (parseFloat(amount) * EXCHANGE_RATE).toFixed(0) : '0'}
                    </span>
                </div>
            </div>

            <input 
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="消費項目說明 (例如: 叻沙午餐)"
            className="w-full bg-white border-b-2 border-gray-100 p-3 text-sm mb-4 outline-none focus:border-sabah-yellow font-serif transition-colors"
            />

            <div className="grid grid-cols-5 gap-1 mb-4">
            {(['food', 'transport', 'shopping', 'stay', 'other'] as const).map(cat => (
                <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-300 border ${
                    category === cat 
                    ? 'bg-sabah-dark text-white border-sabah-dark' 
                    : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                }`}
                >
                <CategoryIcon cat={cat} size={16} />
                <span className="text-[10px] font-bold">{getCategoryName(cat)}</span>
                </button>
            ))}
            </div>

            {/* Payment Details Row */}
            <div className="flex gap-3 mb-6">
                {/* Payer */}
                <div className="flex bg-sabah-bg rounded-xl p-1">
                    <button
                        type="button"
                        onClick={() => setPayer('JIA')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${payer === 'JIA' ? 'bg-sabah-blue text-white shadow-sm' : 'text-gray-400'}`}
                    >JIA</button>
                    <button
                        type="button"
                        onClick={() => setPayer('KIA')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${payer === 'KIA' ? 'bg-sabah-orange text-white shadow-sm' : 'text-gray-400'}`}
                    >KIA</button>
                </div>

                {/* Method */}
                <div className="flex bg-sabah-bg rounded-xl p-1">
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`px-3 py-2 rounded-lg transition-all ${paymentMethod === 'cash' ? 'bg-white text-sabah-dark shadow-sm' : 'text-gray-400'}`}
                    >
                        <Banknote size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`px-3 py-2 rounded-lg transition-all ${paymentMethod === 'card' ? 'bg-white text-sabah-dark shadow-sm' : 'text-gray-400'}`}
                    >
                        <CreditCard size={16} />
                    </button>
                </div>

                {/* Split Toggle */}
                <button
                    type="button"
                    onClick={() => setIsSplit(!isSplit)}
                    className={`flex-1 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all border
                    ${isSplit ? 'bg-sabah-green/10 text-sabah-green border-sabah-green' : 'bg-transparent text-gray-400 border-gray-200'}`}
                >
                    <Users size={14} />
                    分帳
                </button>
            </div>

            <button 
            type="submit"
            className="w-full bg-sabah-yellow text-sabah-dark font-bold py-4 rounded-xl shadow-lg shadow-yellow-200/50 hover:brightness-105 transition-all flex items-center justify-center gap-2"
            >
            <Plus size={18} strokeWidth={3} />
            <span>加入錢包</span>
            </button>
        </form>

        {/* List */}
        <div>
            <h3 className="text-sabah-dark font-serif font-bold text-lg mb-4 pl-1">近期消費</h3>
            <div className="space-y-3">
                {[...filteredExpenses].reverse().map(exp => {
                    const isDeleting = deleteModeId === exp.id;
                    return (
                        <div 
                            key={exp.id} 
                            className={`relative bg-white p-4 rounded-2xl shadow-card transition-all duration-200 select-none
                            ${isDeleting ? 'ring-2 ring-red-400 bg-red-50 scale-[0.98]' : 'hover:border-gray-50 border border-transparent'}
                            `}
                            onMouseDown={() => handleStartPress(exp.id)}
                            onMouseUp={handleEndPress}
                            onTouchStart={() => handleStartPress(exp.id)}
                            onTouchEnd={handleEndPress}
                            onMouseLeave={handleEndPress}
                        >
                            {isDeleting && (
                                <button 
                                    onClick={(e) => confirmDelete(e, exp.id)}
                                    className="absolute inset-0 z-20 bg-red-500/90 rounded-2xl flex items-center justify-center gap-2 text-white font-bold animate-fade-in backdrop-blur-sm"
                                >
                                    <Trash2 size={24} />
                                    <span>確認刪除</span>
                                </button>
                            )}
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center 
                                            ${exp.category === 'food' ? 'bg-orange-50 text-sabah-orange' : 
                                            exp.category === 'transport' ? 'bg-blue-50 text-sabah-blue' : 
                                            exp.category === 'shopping' ? 'bg-yellow-50 text-yellow-600' :
                                            'bg-gray-50 text-gray-500'}`}>
                                            <CategoryIcon cat={exp.category} />
                                        </div>
                                        {exp.isSplit && (
                                            <div className="bg-sabah-green/10 text-sabah-green text-[8px] px-1.5 py-0.5 rounded-full font-bold">分帳</div>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <p className="font-serif font-bold text-sabah-dark text-sm">{exp.description}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                            <span className={`${exp.payer === 'JIA' ? 'text-sabah-blue' : 'text-sabah-orange'}`}>{exp.payer}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                {exp.paymentMethod === 'cash' ? <Banknote size={10} /> : <CreditCard size={10} />}
                                                {exp.paymentMethod === 'cash' ? '現金' : '信用卡'}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-300 mt-0.5">{exp.date.slice(5)} {exp.time}</p>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <p className="font-bold text-sabah-dark">RM {exp.amountMYR}</p>
                                    <p className="text-xs text-gray-400 font-serif">NT$ {exp.amountTWD.toFixed(0)}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filteredExpenses.length === 0 && (
                    <div className="text-center py-10 text-gray-300 text-sm font-serif italic">
                        {filterUser ? `沒有 ${filterUser} 的消費紀錄` : '尚無消費紀錄'}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;