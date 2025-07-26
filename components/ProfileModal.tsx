import React, { useState, useEffect } from 'react';
import useProfiles from '../hooks/useProfile';
import { UserProfile, DinerCounts } from '../types';
import toast from 'react-hot-toast';
import { X, ArrowLeft, UserPlus, Trash2, Edit } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsScreenProps {
  onClose: () => void;
}

const initialDiners: DinerCounts = { toddlers: 0, kids: 0, adults_1: 1, adults_2: 0 };
const initialProfileForm: Omit<UserProfile, 'id'> = {
  name: '',
  diners: initialDiners,
  forbiddenFoods: [],
  prioritizeFavorites: false,
};

const ProfileForm: React.FC<{
    profile?: UserProfile | null,
    onSave: (profile: Omit<UserProfile, 'id'> | UserProfile) => void,
    onCancel: () => void
}> = ({ profile, onSave, onCancel }) => {
    const { t } = useLanguage();
    type TranslationKey = Parameters<typeof t>[0];
    const [formData, setFormData] = useState(profile ? { ...profile } : { ...initialProfileForm });
    const [forbiddenInput, setForbiddenInput] = useState(profile?.forbiddenFoods.join(', ') || '');
    
    useEffect(() => {
        setFormData(profile ? { ...profile } : { ...initialProfileForm });
        setForbiddenInput(profile?.forbiddenFoods.join(', ') || '');
    }, [profile]);


    const handleDinerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, diners: { ...formData.diners, [e.target.name]: parseInt(e.target.value, 10) || 0 } });
    };

    const handleSave = () => {
        const forbiddenFoods = forbiddenInput.split(',').map(s => s.trim()).filter(Boolean);
        if (!formData.name) {
            toast.error(t('profileNameRequiredError'));
            return;
        }
        onSave({ ...formData, forbiddenFoods });
    };

    const dinerTypes: { key: keyof DinerCounts, labelKey: TranslationKey }[] = [
        { key: 'toddlers', labelKey: 'toddlers' },
        { key: 'kids', labelKey: 'kids' },
        { key: 'adults_1', labelKey: 'adults1' },
        { key: 'adults_2', labelKey: 'adults2' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
                 <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold">{profile ? t('editProfile') : t('newProfile')}</h3>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium">{t('profileName')}</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 w-full p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700" placeholder={t('profileNamePlaceholder')}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('dinerCounts')}</label>
                        <div className="grid grid-cols-2 gap-4 mt-1">
                            {dinerTypes.map(({key, labelKey}) => (
                                <div key={key}>
                                    <label className="text-xs">{t(labelKey)}</label>
                                    <input type="number" name={key} value={formData.diners[key as keyof DinerCounts]} onChange={handleDinerChange} min="0" className="w-full p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('forbiddenFoods')}</label>
                        <input type="text" value={forbiddenInput} onChange={e => setForbiddenInput(e.target.value)} className="mt-1 w-full p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700" placeholder={t('forbiddenFoodsPlaceholder')}/>
                    </div>
                    <div className="flex items-center gap-2">
                         <input
                            type="checkbox"
                            id="prioritizeFavorites"
                            checked={formData.prioritizeFavorites}
                            onChange={e => setFormData({ ...formData, prioritizeFavorites: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="prioritizeFavorites" className="text-sm font-medium">{t('prioritizeFavoritesLabel')}</label>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700 flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">{t('cancel')}</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('save')}</button>
                </div>
            </div>
        </div>
    );
};


const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
    const { t } = useLanguage();
    const { profiles, addProfile, updateProfile, deleteProfile, isLoaded } = useProfiles();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);

    const handleSaveProfile = (profileData: Omit<UserProfile, 'id'> | UserProfile) => {
        if ('id' in profileData) {
            updateProfile(profileData as UserProfile);
            toast.success(t('profileUpdatedSuccess'));
        } else {
            addProfile(profileData);
            toast.success(t('profileCreatedSuccess'));
        }
        setIsFormOpen(false);
        setEditingProfile(null);
    };

    if (!isLoaded) {
      return <div>{t('loading')}...</div>
    }

    return (
        <div className="w-full mx-auto space-y-8">
            <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-bold">{t('settings')}</h2>
                <button onClick={onClose} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <ArrowLeft size={16} />
                    {t('back')}
                </button>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{t('myProfiles')} ({profiles.length}/5)</h3>
                     <button onClick={() => { setEditingProfile(null); setIsFormOpen(true); }} disabled={profiles.length >= 5} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors disabled:bg-blue-400">
                        <UserPlus size={16} />
                        {t('createProfile')}
                    </button>
                </div>
                <div className="space-y-3">
                    {profiles.length > 0 ? (
                        profiles.map(p => (
                            <div key={p.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="font-medium">{p.name}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingProfile(p); setIsFormOpen(true); }} className="p-1.5 text-gray-500 hover:text-blue-500"><Edit size={18} /></button>
                                    <button onClick={() => deleteProfile(p.id)} className="p-1.5 text-gray-500 hover:text-red-500"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">{t('noProfilesYet')}</p>
                    )}
                </div>
            </div>

             <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{t('userAccount')}</h3>
                <p className="text-center text-gray-500 py-4">{t('userAccountSoon')}</p>
            </div>

            {isFormOpen && <ProfileForm profile={editingProfile} onSave={handleSaveProfile} onCancel={() => setIsFormOpen(false)} />}
        </div>
  );
};

export default SettingsScreen;