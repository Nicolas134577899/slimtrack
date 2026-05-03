import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar,
} from 'react-native';

const C = {
  bg: '#0d0d1a', bg2: '#12122a', card: '#131328', border: '#1e1e40',
  border2: '#222244', text: '#e8e8f0', muted: '#9999bb', faint: '#555577',
  green: '#1DD1A1', orange: '#FF9F43', red: '#EE5A24', purple: '#5F27CD', blue: '#4ECDC4',
};

const MEALS = {
  breakfast: { label: 'Petit-déj', icon: '☀️', color: '#FF9F43' },
  lunch:     { label: 'Déjeuner',  icon: '🌿', color: '#1DD1A1' },
  dinner:    { label: 'Dîner',     icon: '🌙', color: '#5F27CD' },
  snack:     { label: 'Collation', icon: '🍎', color: '#EE5A24' },
};

const EXERCISES = [
  { name: 'Marche',   kcal: 250, icon: '🚶', duration: '30 min' },
  { name: 'Course',   kcal: 450, icon: '🏃', duration: '30 min' },
  { name: 'Vélo',     kcal: 350, icon: '🚴', duration: '30 min' },
  { name: 'Natation', kcal: 400, icon: '🏊', duration: '30 min' },
  { name: 'Yoga',     kcal: 150, icon: '🧘', duration: '45 min' },
  { name: 'HIIT',     kcal: 550, icon: '⚡', duration: '20 min' },
  { name: 'Muscu',    kcal: 300, icon: '💪', duration: '45 min' },
  { name: 'Danse',    kcal: 320, icon: '💃', duration: '30 min' },
];

const TIPS = [
  "Buvez un verre d'eau avant chaque repas.",
  "Mangez lentement — le cerveau met 20 min à ressentir la satiété.",
  "Dormez 7-8h : le manque de sommeil fait grossir.",
  "Privilégiez les protéines au petit-déjeuner.",
  "Évitez les écrans pendant les repas.",
  "Ajoutez des légumes à chaque assiette.",
];

const GOAL = 1800;
const WATER_GOAL = 8;
const TIP = TIPS[Math.floor(Math.random() * TIPS.length)];

function StatCard({ icon, label, value, color }) {
  return (
    <View style={[s.statCard, { borderLeftColor: color }]}>
      <Text style={{ fontSize: 14 }}>{icon}</Text>
      <View>
        <Text style={s.statLabel}>{label}</Text>
        <Text style={[s.statVal, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [tab, setTab] = useState('today');
  const [calories, setCalories] = useState(0);
  const [burned, setBurned] = useState(0);
  const [water, setWater] = useState(0);
  const [foodLog, setFoodLog] = useState([]);
  const [exLog, setExLog] = useState([]);
  const [savedWeight, setSavedWeight] = useState(null);
  const [savedTarget, setSavedTarget] = useState(null);
  const [foodInput, setFoodInput] = useState('');
  const [kcalInput, setKcalInput] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [wInput, setWInput] = useState('');
  const [tInput, setTInput] = useState('');

  const now = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const addFood = () => {
    if (!foodInput.trim() || !kcalInput) return;
    const entry = { id: Date.now(), food: foodInput.trim(), kcal: parseInt(kcalInput), meal: mealType, time: now() };
    setFoodLog(l => [entry, ...l]);
    setCalories(c => c + entry.kcal);
    setFoodInput(''); setKcalInput('');
  };

  const removeFood = (id, kcal) => {
    setFoodLog(l => l.filter(e => e.id !== id));
    setCalories(c => Math.max(0, c - kcal));
  };

  const addEx = (ex) => {
    setExLog(l => [{ ...ex, id: Date.now(), time: now() }, ...l]);
    setBurned(b => b + ex.kcal);
  };

  const removeEx = (id, kcal) => {
    setExLog(l => l.filter(e => e.id !== id));
    setBurned(b => Math.max(0, b - kcal));
  };

  const remaining = Math.max(GOAL - calories, 0);
  const deficit = Math.max(GOAL - (calories - burned), 0);
  const diff = savedWeight && savedTarget ? (savedWeight - savedTarget) : null;
  const days = diff > 0 ? Math.ceil((diff * 7700) / 500) : null;

  const tabs = [
    { key: 'today', icon: '📋', label: "Auj." },
    { key: 'food', icon: '🍽️', label: 'Repas' },
    { key: 'exercise', icon: '🏋️', label: 'Sport' },
    { key: 'goals', icon: '🎯', label: 'Objectifs' },
  ];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={s.header}>
            <View style={s.logoRow}>
              <Text style={s.logoIcon}>🌱</Text>
              <Text style={s.logoText}>SlimTrack</Text>
            </View>
            <View style={s.tipBox}>
              <Text style={{ fontSize: 13 }}>💡</Text>
              <Text style={s.tipTxt}>{TIP}</Text>
            </View>
          </View>

          {tab === 'today' && (
            <View style={s.page}>
              <View style={s.ringRow}>
                <View style={s.ringWrap}>
                  <View style={[s.ringCircle, { borderColor: '#1a1a2e' }]} />
                  <View style={[s.ringCircle, {
                    borderColor: calories >= GOAL ? C.red : C.green,
                    borderTopColor: calories / GOAL > 0.75 ? (calories >= GOAL ? C.red : C.green) : 'transparent',
                    borderRightColor: calories / GOAL > 0.5 ? (calories >= GOAL ? C.red : C.green) : 'transparent',
                    borderBottomColor: calories / GOAL > 0.25 ? (calories >= GOAL ? C.red : C.green) : 'transparent',
                    borderLeftColor: calories > 0 ? (calories >= GOAL ? C.red : C.green) : 'transparent',
                    position: 'absolute',
                  }]} />
                  <View style={s.ringInner}>
                    <Text style={s.ringVal}>{calories}</Text>
                    <Text style={s.ringUnit}>kcal</Text>
                  </View>
                </View>
                <View style={s.statsCol}>
                  <StatCard icon="🎯" label="Objectif" value={`${GOAL} kcal`} color={C.orange} />
                  <StatCard icon="🔥" label="Brûlées" value={`${burned} kcal`} color={C.red} />
                  <StatCard icon="⚡" label="Restant" value={`${remaining} kcal`} color={C.green} />
                  <StatCard icon="📉" label="Déficit" value={`${deficit} kcal`} color={C.purple} />
                </View>
              </View>

              <View style={s.card}>
                <View style={s.rowBetween}>
                  <Text style={s.cardTitle}>💧 Hydratation</Text>
                  <Text style={{ color: C.blue, fontWeight: '700', fontSize: 13 }}>{water}/{WATER_GOAL}</Text>
                </View>
                <View style={s.dots}>
                  {Array.from({ length: WATER_GOAL }).map((_, i) => (
                    <View key={i} style={[s.dot, { backgroundColor: i < water ? C.blue : '#1a1a2e' }]} />
                  ))}
                </View>
                <TouchableOpacity style={s.outlineBtn} onPress={() => setWater(w => Math.min(w + 1, WATER_GOAL))}>
                  <Text style={[s.outlineBtnTxt, { color: C.blue }]}>+ Ajouter un verre</Text>
                </TouchableOpacity>
              </View>

              {foodLog.length > 0 && (
                <View style={s.card}>
                  <Text style={s.cardTitle}>🍽️ Repas du jour</Text>
                  {foodLog.map(e => (
                    <View key={e.id} style={s.logRow}>
                      <Text style={{ fontSize: 15 }}>{MEALS[e.meal]?.icon}</Text>
                      <Text style={s.logFood} numberOfLines={1}>{e.food}</Text>
                      <Text style={[s.logKcal, { color: C.green }]}>{e.kcal}</Text>
                      <Text style={s.logTime}>{e.time}</Text>
                      <TouchableOpacity onPress={() => removeFood(e.id, e.kcal)}>
                        <Text style={{ color: C.faint, fontSize: 13 }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {exLog.length > 0 && (
                <View style={s.card}>
                  <Text style={s.cardTitle}>🏃 Activités du jour</Text>
                  {exLog.map(e => (
                    <View key={e.id} style={s.logRow}>
                      <Text style={{ fontSize: 15 }}>{e.icon}</Text>
                      <Text style={s.logFood} numberOfLines={1}>{e.name}</Text>
                      <Text style={[s.logKcal, { color: C.red }]}>-{e.kcal}</Text>
                      <Text style={s.logTime}>{e.time}</Text>
                      <TouchableOpacity onPress={() => removeEx(e.id, e.kcal)}>
                        <Text style={{ color: C.faint, fontSize: 13 }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {tab === 'food' && (
            <View style={s.page}>
              <View style={s.card}>
                <Text style={s.cardTitle}>➕ Ajouter un aliment</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {Object.entries(MEALS).map(([key, m]) => (
                      <TouchableOpacity key={key}
                        style={[s.mealTab, { borderColor: m.color, backgroundColor: mealType === key ? m.color : 'transparent' }]}
                        onPress={() => setMealType(key)}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: mealType === key ? '#fff' : m.color }}>{m.icon} {m.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
                <TextInput style={s.input} placeholder="Aliment (ex: Poulet grillé)" placeholderTextColor={C.faint} value={foodInput} onChangeText={setFoodInput} />
                <TextInput style={s.input} placeholder="Calories (kcal)" placeholderTextColor={C.faint} value={kcalInput} onChangeText={setKcalInput} keyboardType="numeric" />
                <TouchableOpacity style={s.btn} onPress={addFood}>
                  <Text style={s.btnTxt}>Ajouter</Text>
                </TouchableOpacity>
              </View>

              <View style={s.card}>
                <Text style={s.cardTitle}>📊 Par repas</Text>
                {Object.entries(MEALS).map(([key, m]) => {
                  const total = foodLog.filter(e => e.meal === key).reduce((sum, e) => sum + e.kcal, 0);
                  return (
                    <View key={key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 }}>
                      <Text style={{ fontSize: 15, width: 22 }}>{m.icon}</Text>
                      <Text style={{ fontSize: 12, color: C.muted, width: 70 }}>{m.label}</Text>
                      <View style={{ flex: 1, height: 6, backgroundColor: '#1a1a35', borderRadius: 3, overflow: 'hidden' }}>
                        <View style={{ height: '100%', width: `${Math.min((total / 700) * 100, 100)}%`, backgroundColor: m.color, borderRadius: 3 }} />
                      </View>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: m.color, width: 45, textAlign: 'right' }}>{total}</Text>
                    </View>
                  );
                })}
                <View style={[s.rowBetween, { paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border }]}>
                  <Text style={{ color: C.muted, fontWeight: '600' }}>Total</Text>
                  <Text style={{ color: C.green, fontWeight: '700', fontSize: 15 }}>{calories} kcal</Text>
                </View>
              </View>
            </View>
          )}

          {tab === 'exercise' && (
            <View style={s.page}>
              <View style={[s.card, { alignItems: 'center', backgroundColor: '#1a0d0d', borderColor: '#3a1a1a' }]}>
                <Text style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>Calories brûlées aujourd'hui</Text>
                <Text style={{ fontSize: 52, fontWeight: '800', color: C.red }}>{burned} <Text style={{ fontSize: 18, color: C.muted }}>kcal</Text></Text>
              </View>
              <Text style={{ color: C.muted, fontSize: 13, fontWeight: '600', marginBottom: 10 }}>Sélectionnez une activité :</Text>
              <View style={s.grid}>
                {EXERCISES.map(ex => (
                  <TouchableOpacity key={ex.name} style={s.exCard} onPress={() => addEx(ex)} activeOpacity={0.7}>
                    <Text style={{ fontSize: 28 }}>{ex.icon}</Text>
                    <Text style={{ fontSize: 12, color: '#d0d0ea', fontWeight: '600', textAlign: 'center' }}>{ex.name}</Text>
                    <Text style={{ fontSize: 11, color: C.faint }}>{ex.duration}</Text>
                    <View style={{ backgroundColor: '#2a1010', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4, borderWidth: 1, borderColor: '#3a1a1a' }}>
                      <Text style={{ fontSize: 11, color: C.red, fontWeight: '700' }}>-{ex.kcal} kcal</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {tab === 'goals' && (
            <View style={s.page}>
              <View style={s.card}>
                <Text style={s.cardTitle}>⚖️ Mon poids</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>Poids actuel (kg)</Text>
                    <TextInput style={s.input} placeholder="ex: 82" placeholderTextColor={C.faint} value={wInput} onChangeText={setWInput} keyboardType="decimal-pad" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>Objectif (kg)</Text>
                    <TextInput style={s.input} placeholder="ex: 72" placeholderTextColor={C.faint} value={tInput} onChangeText={setTInput} keyboardType="decimal-pad" />
                  </View>
                </View>
                <TouchableOpacity style={s.btn} onPress={() => {
                  const w = parseFloat(wInput); const t = parseFloat(tInput);
                  if (!isNaN(w)) setSavedWeight(w);
                  if (!isNaN(t)) setSavedTarget(t);
                }}>
                  <Text style={s.btnTxt}>Enregistrer</Text>
                </TouchableOpacity>
                {savedWeight && savedTarget && (
                  <View style={{ marginTop: 14, backgroundColor: C.bg, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: C.border2 }}>
                    {[
                      { label: 'Poids actuel', value: `${savedWeight} kg`, color: C.orange },
                      { label: 'Objectif', value: `${savedTarget} kg`, color: C.green },
                      { label: 'À perdre', value: diff > 0 ? `${diff.toFixed(1)} kg` : '🎉 Objectif atteint !', color: C.red },
                    ].map(r => (
                      <View key={r.label} style={[s.rowBetween, { paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.border }]}>
                        <Text style={{ color: C.muted, fontSize: 13 }}>{r.label}</Text>
                        <Text style={{ color: r.color, fontWeight: '700', fontSize: 15 }}>{r.value}</Text>
                      </View>
                    ))}
                    {days && (
                      <View style={{ marginTop: 10, backgroundColor: '#1a1240', borderRadius: 8, padding: 10 }}>
                        <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18 }}>
                          À 500 kcal/jour de déficit, objectif atteint en{' '}
                          <Text style={{ color: C.purple, fontWeight: '700' }}>{days} jours</Text>
                          {' '}(~{Math.ceil(days / 30)} mois).
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              <View style={s.card}>
                <Text style={s.cardTitle}>📋 Conseils minceur</Text>
                {TIPS.map((tip, i) => (
                  <View key={i} style={[s.logRow, { alignItems: 'flex-start', paddingVertical: 8 }]}>
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{i + 1}</Text>
                    </View>
                    <Text style={{ flex: 1, fontSize: 13, color: C.muted, lineHeight: 19 }}>{tip}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={s.tabBar}>
        {tabs.map(t => (
          <TouchableOpacity key={t.key} style={s.tabBtn} onPress={() => setTab(t.key)}>
            <Text style={{ fontSize: 20, opacity: tab === t.key ? 1 : 0.35 }}>{t.icon}</Text>
            <Text style={[s.tabLabel, { color: tab === t.key ? C.green : C.faint }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44 },
  scroll: { flex: 1 },
  page: { padding: 16, paddingTop: 8 },
  header: { padding: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  logoIcon: { fontSize: 24, marginRight: 8 },
  logoText: { fontSize: 24, fontWeight: '800', color: C.green, letterSpacing: 1 },
  tipBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: C.card, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: C.border2, gap: 6 },
  tipTxt: { flex: 1, fontSize: 12, color: C.muted, lineHeight: 18 },
  ringRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 14 },
  ringWrap: { width: 130, height: 130, alignItems: 'center', justifyContent: 'center' },
  ringCircle: { width: 130, height: 130, borderRadius: 65, borderWidth: 11, position: 'absolute' },
  ringInner: { alignItems: 'center' },
  ringVal: { fontSize: 26, fontWeight: '800', color: '#fff' },
  ringUnit: { fontSize: 11, color: C.faint },
  statsCol: { flex: 1, gap: 6 },
  statCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 8, padding: 8, borderLeftWidth: 3, gap: 8 },
  statLabel: { fontSize: 10, color: C.muted },
  statVal: { fontSize: 12, fontWeight: '700' },
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: C.border },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#c8c8e8', marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 7, marginBottom: 12, flexWrap: 'wrap' },
  dot: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: C.blue },
  outlineBtn: { borderWidth: 1, borderColor: C.blue, borderRadius: 8, padding: 10, alignItems: 'center' },
  outlineBtnTxt: { fontSize: 13, fontWeight: '600' },
  logRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.border, gap: 8 },
  logFood: { flex: 1, fontSize: 13, color: '#d0d0ea' },
  logKcal: { fontSize: 12, fontWeight: '700' },
  logTime: { fontSize: 10, color: C.faint },
  input: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border2, borderRadius: 8, padding: 11, color: C.text, fontSize: 14, marginBottom: 10 },
  btn: { padding: 13, borderRadius: 8, backgroundColor: C.green, alignItems: 'center' },
  btnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  mealTab: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  exCard: { width: '47%', backgroundColor: C.card, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border, gap: 3 },
  tabBar: { flexDirection: 'row', backgroundColor: '#0a0a18', borderTopWidth: 1, borderTopColor: C.border, height: 65, paddingBottom: 8 },
  tabBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabLabel: { fontSize: 10, fontWeight: '600' },
});
