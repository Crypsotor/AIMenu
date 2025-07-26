import React, { useMemo, useState } from 'react';
import { Calendar, ShoppingListItem } from '../types';
import { ArrowLeft, CheckSquare, Square } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ShoppingListScreenProps {
  calendar: Calendar;
  onBack: () => void;
}

const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({ calendar, onBack }) => {
  const { t } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const groupedList = useMemo(() => {
    if (!calendar.shoppingList) return {};
    return calendar.shoppingList.reduce((acc, item) => {
      const category = item.category || t('categoryOther');
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as { [key: string]: ShoppingListItem[] });
  }, [calendar.shoppingList, t]);

  const toggleItem = (itemName: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };
  
  const categoryOrder = [
    t('categoryFruitsVegetables'),
    t('categoryButcher'),
    t('categoryFishmonger'),
    t('categoryDairyEggs'),
    t('categoryBakery'),
    t('categoryPantry'),
    t('categoryBeverages'),
    t('categoryFrozen'),
    t('categoryOther')
  ];
  
  const sortedCategories = Object.keys(groupedList).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
  });

  return (
    <div className="w-full mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold">{t('shoppingList')}</h2>
            <p className="text-gray-500">{t('forCalendar')}: "{calendar.name}"</p>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          <ArrowLeft size={16} /> {t('backToHistory')}
        </button>
      </div>

      <div className="space-y-6">
        {sortedCategories.map(category => (
          <div key={category} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">{category}</h3>
            <div className="space-y-3">
              {groupedList[category].map((item, index) => {
                const isChecked = checkedItems.has(item.name);
                return (
                  <button 
                    key={`${item.name}-${index}`} 
                    onClick={() => toggleItem(item.name)}
                    className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  >
                    {isChecked ? <CheckSquare size={20} className="text-green-500" /> : <Square size={20} className="text-gray-400" />}
                    <div className={`flex-grow text-left ${isChecked ? 'line-through text-gray-400' : ''}`}>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({item.quantity})</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingListScreen;