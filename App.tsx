
import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { INITIAL_ITINERARY, INITIAL_EXPENSES } from './constants';
import { DayPlan, Expense, Tab } from './types';
import DateSelector from './components/DateSelector';
import ItineraryList from './components/ItineraryList';
import ExpenseTracker from './components/ExpenseTracker';
import MapComponent from './components/MapComponent';
import ShoppingList from './components/ShoppingList';
import InfoPage from './components/InfoPage';
import { Calendar, Map as MapIcon, Wallet, ShoppingBag, Info, Cloud, Sun, CloudRain } from 'lucide-react';

// Weather Helpers (Moved from ItineraryList)
const WeatherIcon = ({ condition }: { condition: string }) => {
  const cond = condition.toLowerCase();
  if (cond.includes('rain')) return <CloudRain className="w-5 h-5 text-gray-500" />;
  if (cond.includes('cloud')) return <Cloud className="w-5 h-5 text-gray-500" />;
  return <Sun className="w-5 h-5 text-sabah-yellow" />;
};

const getWeatherLabel = (condition: string) => {
  const cond = condition.toLowerCase();
  if (cond.includes('rain')) return '雨天';
  if (cond.includes('cloud')) return '多雲';
  return '晴朗';
};

const SplashScreen = ({ onDismiss }: { onDismiss: () => void }) => (
  <div 
    onClick={onDismiss}
    className="fixed inset-0 z-[100] cursor-pointer bg-black"
  >
    <img 
      src="https://i.pinimg.com/736x/a1/68/29/a168297e14852587d40f2ac06dd2a1e5.jpg" 
      alt="Splash" 
      className="absolute inset-0 w-full h-full object-cover animate-fade-in opacity-90"
    />
    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
      <div className="space-y-4 animate-[fadeIn_1s_ease-out]">
        <p className="text-xl font-sans tracking-[0.3em] font-light uppercase opacity-90">Welcome to</p>
        <h1 className="text-6xl font-serif font-black tracking-wider drop-shadow-2xl">SABAH</h1>
        <div className="w-12 h-1 bg-white/80 mx-auto rounded-full mt-6"></div>
        <p className="text-xs font-sans mt-8 opacity-70 animate-pulse">點擊任意處開始</p>
      </div>
    </div>
  </div>
);

interface NavItemProps {
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 w-full ${isActive ? 'text-sabah-blue' : 'text-gray-400 hover:text-gray-600'}`}
  >
    <div className={`p-1.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-blue-50/80 scale-110 -translate-y-1' : 'bg-transparent'}`}>
      {React.cloneElement(icon as React.ReactElement<any>, { 
        size: 24, 
        strokeWidth: isActive ? 2.5 : 2 
      })}
    </div>
    <span className={`text-[10px] font-bold transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
      {label}
    </span>
  </button>
);

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('plan');
  const [dayPlans, setDayPlans] = useState<DayPlan[]>(INITIAL_ITINERARY);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [selectedDate, setSelectedDate] = useState<string>(INITIAL_ITINERARY[0].date);

  const currentDayPlan = dayPlans.find(d => d.date === selectedDate) || dayPlans[0];

  const handleUpdateDay = (updated: DayPlan) => {
    setDayPlans(prev => prev.map(d => d.date === updated.date ? updated : d));
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return (
    <HashRouter>
      {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}
      
      {/* Outer container: centered, dark bg for desktop view */}
      <div className="flex justify-center min-h-dvh bg-gray-900 font-sans text-sabah-dark">
        
        {/* Mobile Frame Container: constrained max-width, full height */}
        <div className="w-full max-w-[480px] h-dvh relative shadow-2xl overflow-hidden flex flex-col bg-sabah-bg">
          
          {/* Background Layer: Absolute positioning with object-fit: cover */}
          <div className="absolute inset-0 z-0">
             {activeTab === 'plan' && currentDayPlan.bgImage ? (
                <>
                  <img 
                    key={currentDayPlan.bgImage}
                    src={currentDayPlan.bgImage} 
                    alt="Background" 
                    className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                  />
                  {/* Overlay for text readability */}
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
                </>
             ) : (
                <div className="w-full h-full bg-sabah-bg"></div>
             )}
          </div>

          {/* Top Bar / Header Area - Modified for Plan */}
          {(activeTab === 'plan') && (
            <div className="relative z-20 bg-white/30 backdrop-blur-md shadow-sm border-b border-white/20 pb-2">
               {/* 1. Title at top */}
               <div className="pt-safe pb-1 text-center mb-2">
                  <h2 className="text-2xl font-serif font-bold text-sabah-dark drop-shadow-sm mt-3">Sabah | 亞庇海中遊</h2>
               </div>

               {/* 2. Row: DateSelector | Weather Info */}
               <div className="flex items-center justify-between px-2">
                  <div className="flex-1 overflow-hidden">
                     <DateSelector 
                      days={dayPlans} 
                      selectedDate={selectedDate} 
                      onSelectDate={setSelectedDate} 
                    />
                  </div>
                  
                  {/* 3. Stacked Info */}
                  <div className="flex flex-col items-end pl-2 pr-4 gap-1 min-w-[80px]">
                      <span className="bg-sabah-blue/90 text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide shadow-sm">
                        MALAYSIA
                      </span>
                      <div className="flex items-center gap-1.5 bg-white/90 px-2 py-1 rounded-lg shadow-sm">
                          <WeatherIcon condition={currentDayPlan.weatherCondition} />
                          <div className="flex flex-col items-end leading-none">
                            <span className="text-xs font-bold text-sabah-dark">{currentDayPlan.weatherTemp}°C</span>
                            <span className="text-[8px] text-gray-400 font-medium">{getWeatherLabel(currentDayPlan.weatherCondition)}</span>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
          )}

          {/* Main Content Area (Scrollable) */}
          <main className={`flex-1 overflow-y-auto no-scrollbar relative z-10 ${activeTab === 'map' ? 'h-full' : ''}`}>
            {activeTab === 'plan' && (
              <ItineraryList dayPlan={currentDayPlan} onUpdate={handleUpdateDay} />
            )}
            {activeTab === 'map' && (
              <div className="h-full w-full">
                 <MapComponent dayPlans={dayPlans} selectedDate={selectedDate} />
              </div>
            )}
            {activeTab === 'wallet' && (
              <div className="min-h-full">
                <ExpenseTracker 
                  expenses={expenses} 
                  onAddExpense={handleAddExpense} 
                  onDeleteExpense={handleDeleteExpense}
                />
              </div>
            )}
            {activeTab === 'shopping' && <ShoppingList />}
            {activeTab === 'info' && <InfoPage />}
          </main>

          {/* Bottom Navigation */}
          <nav className="relative z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center px-4 py-2">
              <NavItem 
                icon={<Calendar />} 
                label="行程" 
                isActive={activeTab === 'plan'} 
                onClick={() => setActiveTab('plan')} 
              />
              <NavItem 
                icon={<MapIcon />} 
                label="地圖" 
                isActive={activeTab === 'map'} 
                onClick={() => setActiveTab('map')} 
              />
              <NavItem 
                icon={<Wallet />} 
                label="記帳" 
                isActive={activeTab === 'wallet'} 
                onClick={() => setActiveTab('wallet')} 
              />
              <NavItem 
                icon={<ShoppingBag />} 
                label="購物" 
                isActive={activeTab === 'shopping'} 
                onClick={() => setActiveTab('shopping')} 
              />
              <NavItem 
                icon={<Info />} 
                label="資訊" 
                isActive={activeTab === 'info'} 
                onClick={() => setActiveTab('info')} 
              />
            </div>
          </nav>

        </div>
      </div>
    </HashRouter>
  );
};

export default App;
