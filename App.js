import React, { useMemo, useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Modal, Platform, Pressable,
  ScrollView, StatusBar, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const C = {
  bg: '#080B14', panel: '#111624', panel2: '#171D2D', white: '#F6F7FB',
  muted: '#8D96AA', purple: '#8B5CF6', pink: '#EC4899', line: '#252B3B', green: '#39D98A'
};
const initialMovies = [
  {
    id: 'aqz-KE-bpKQ', title: 'Big Buck Bunny', kind: 'Film',
    subtitle: 'Blender Open Movie · Açık lisanslı kısa film',
    emoji: '🐰', colors: ['#255C63', '#142638'], duration: '10 dk',
    description: 'Blender Foundation tarafından yayımlanan açık film. YouTube oynatıcısında açılır.'
  },
];

function getYoutubeId(value) {
  const raw = (value || '').trim();
  if (/^[\w-]{11}$/.test(raw)) return raw;
  const match = raw.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/i);
  return match ? match[1] : null;
}
function PlayerPage({ item, onBack }) {
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><style>*{margin:0;padding:0}html,body,#p{height:100%;background:#000}iframe{width:100%;height:100%;border:0}</style></head><body><div id="p"><iframe src="https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&playsinline=1&controls=1&rel=0" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></body></html>`;
  return <SafeAreaView style={s.safe} edges={['top','bottom']}>
    <View style={s.playerHeader}>
      <Pressable onPress={onBack} style={s.iconButton}><Ionicons name="chevron-back" size={25} color={C.white}/></Pressable>
      <Text style={s.playerHeaderTitle}>ŞİMDİ İZLİYORSUN</Text>
      <View style={{width:42}} />
    </View>
    <View style={s.videoFrame}>
      <WebView source={{ html, baseUrl: 'https://www.youtube-nocookie.com' }} javaScriptEnabled domStorageEnabled
        allowsFullscreenVideo allowsInlineMediaPlayback mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false} style={{backgroundColor:'#000'}} />
    </View>
    <ScrollView contentContainerStyle={s.playerInfo}>
      <View style={s.rowBetween}>
        <View style={{flex:1, paddingRight:12}}>
          <Text style={s.playerTitle}>{item.title}</Text>
          <Text style={s.subtle}>{item.kind}{item.subtitle ? `  ·  ${item.subtitle}` : ''}</Text>
        </View>
        <View style={s.quality}><Ionicons name="logo-youtube" color="#FF4444" size={16}/><Text style={s.qualityText}> YouTube</Text></View>
      </View>
      {!!item.description && <Text style={s.description}>{item.description}</Text>}
      <Text style={s.playerNote}>Oynatma, YouTube’un resmi gömülü oynatıcısı üzerinden yapılır. Bazı videolarda video sahibi gömmeye izin vermemiş olabilir.</Text>
    </ScrollView>
  </SafeAreaView>;
}
function Poster({ item, large=false }) {
  return <LinearGradient colors={item.colors || ['#4C327A','#17233B']} style={[s.poster, large && s.posterLarge]}>
    <View style={s.posterTop}><Text style={s.posterBadge}>{item.kind.toUpperCase()}</Text><Ionicons name="ellipsis-horizontal" size={19} color="#FFFFFFCC"/></View>
    <Text style={[s.posterEmoji, large && {fontSize:72}]}>{item.emoji || '🎬'}</Text>
    <View style={s.posterBottom}><Text numberOfLines={2} style={[s.posterTitle, large && {fontSize:23}]}>{item.title}</Text><Text style={s.posterMeta}>{item.duration || 'YouTube'}</Text></View>
  </LinearGradient>;
}
function VideoCard({ item, onPress, saved, onSave }) {
  return <View style={s.card}>
    <Pressable onPress={onPress}><Poster item={item}/></Pressable>
    <View style={s.cardInfo}>
      <Pressable onPress={onPress} style={{flex:1}}><Text numberOfLines={1} style={s.cardTitle}>{item.title}</Text><Text style={s.subtle} numberOfLines={1}>{item.kind} · YouTube</Text></Pressable>
      <Pressable onPress={onSave} style={s.saveButton} accessibilityLabel={saved ? 'Listemden çıkar' : 'Listeme ekle'}><Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={saved ? C.purple : C.muted}/></Pressable>
    </View>
  </View>;
}
function AddModal({ visible, onClose, onAdd }) {
  const [title,setTitle]=useState(''); const [url,setUrl]=useState(''); const [kind,setKind]=useState('Film');
  const submit=()=>{
    const videoId=getYoutubeId(url);
    if(!title.trim() || !videoId){ Alert.alert('Bilgileri kontrol et','Bir başlık ve geçerli bir YouTube video bağlantısı gir.'); return; }
    onAdd({id:videoId,title:title.trim(),kind,subtitle:kind==='Dizi'?'YouTube bölümü':'YouTube videosu',emoji:kind==='Dizi'?'📺':'🎞️',colors:kind==='Dizi'?['#594285','#21264B']:['#78404B','#30203E'],description:'Kullanıcının eklediği YouTube videosu.'});
    setTitle('');setUrl('');setKind('Film');onClose();
  };
  return <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <View style={s.modalShade}><KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={s.modalWrap}>
      <View style={s.modalCard}><View style={s.rowBetween}><Text style={s.modalTitle}>İçerik ekle</Text><Pressable onPress={onClose} style={s.iconButton}><Ionicons name="close" size={22} color={C.white}/></Pressable></View>
        <Text style={s.fieldLabel}>İÇERİK TÜRÜ</Text><View style={s.segmentRow}>{['Film','Dizi'].map(x=><Pressable key={x} onPress={()=>setKind(x)} style={[s.segment,kind===x&&s.segmentActive]}><Text style={[s.segmentText,kind===x&&s.segmentTextActive]}>{x}</Text></Pressable>)}</View>
        <Text style={s.fieldLabel}>BAŞLIK</Text><TextInput value={title} onChangeText={setTitle} placeholder="Örn. Birinci bölüm" placeholderTextColor="#687187" style={s.input}/>
        <Text style={s.fieldLabel}>YOUTUBE VİDEO LİNKİ</Text><TextInput value={url} onChangeText={setUrl} placeholder="https://www.youtube.com/watch?v=…" placeholderTextColor="#687187" autoCapitalize="none" autoCorrect={false} style={s.input}/>
        <Text style={s.formHint}>YouTube bağlantısı veya 11 karakterli video kimliği ekle. Oynatma YouTube üzerinden yapılır; video indirilmez.</Text>
        <Pressable onPress={submit} style={s.primaryButton}><Text style={s.primaryButtonText}>Kütüphaneye ekle</Text><Ionicons name="add" size={20} color="white"/></Pressable>
      </View>
    </KeyboardAvoidingView></View>
  </Modal>;
}
function MainApp() {
  const [items,setItems]=useState(initialMovies); const [saved,setSaved]=useState([]);
  const [tab,setTab]=useState('Ana sayfa'); const [filter,setFilter]=useState('Tümü');
  const [query,setQuery]=useState(''); const [searching,setSearching]=useState(false);
  const [showAdd,setShowAdd]=useState(false); const [playing,setPlaying]=useState(null);
  const filtered=useMemo(()=>items.filter(i=>(filter==='Tümü'||i.kind===filter)&&i.title.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))),[items,filter,query]);
  const library=tab==='Listem'?items.filter(i=>saved.includes(i.id)):filtered;
  const toggleSave=(id)=>setSaved(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const addItem=(item)=>{setItems(prev=>prev.some(x=>x.id===item.id)?prev:[item,...prev]);setTab('Keşfet');};
  if(playing) return <PlayerPage item={playing} onBack={()=>setPlaying(null)}/>;
  return <SafeAreaView style={s.safe} edges={['top']}>
    <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
    <View style={s.header}><View style={s.brandRow}><View style={s.logoMark}><Ionicons name="play" size={16} color="white"/></View><Text style={s.brand}>vah<Text style={{color:C.pink}}>flix</Text></Text></View>
      <View style={s.headerActions}><Pressable onPress={()=>setSearching(!searching)} style={s.iconButton}><Ionicons name={searching?'close':'search'} size={21} color={C.white}/></Pressable><Pressable onPress={()=>setShowAdd(true)} style={[s.iconButton,s.addIcon]}><Ionicons name="add" size={22} color="white"/></Pressable></View>
    </View>
    {searching&&<View style={s.searchBox}><Ionicons name="search" size={18} color={C.muted}/><TextInput value={query} onChangeText={setQuery} placeholder="Film veya dizi ara" placeholderTextColor={C.muted} style={s.searchInput}/></View>}
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
      {tab==='Ana sayfa' ? <>
        <Text style={s.eyebrow}>KENDİ KÜTÜPHANEN</Text>
        <LinearGradient colors={['#34215E','#1A1C36','#111624']} style={s.hero}>
          <View style={s.heroGlow}/><View style={s.heroCopy}><View style={s.newTag}><View style={s.liveDot}/><Text style={s.newTagText}>VAHFLIX’TE</Text></View><Text style={s.heroTitle}>İzlemeye{ '\n' }başla.</Text><Text style={s.heroSub}>YouTube’daki izlemeye uygun içeriklerini burada bir araya getir.</Text><Pressable onPress={()=>setPlaying(items[0])} style={s.watchButton}><Ionicons name="play" size={16} color="#171222"/><Text style={s.watchText}>Şimdi izle</Text></Pressable></View>
          <Text style={s.heroEmoji}>🎬</Text><Text style={s.heroLabel}>VAHFLIX</Text>
        </LinearGradient>
        <View style={s.sectionHead}><View><Text style={s.sectionTitle}>Öne çıkan</Text><Text style={s.sectionCaption}>İzlemeye hazır içerikler</Text></View><Pressable onPress={()=>setTab('Keşfet')}><Text style={s.seeAll}>Tümünü gör</Text></Pressable></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontalCards}>{items.slice(0,8).map(item=><VideoCard key={item.id} item={item} onPress={()=>setPlaying(item)} saved={saved.includes(item.id)} onSave={()=>toggleSave(item.id)}/>)}</ScrollView>
        <View style={s.tip}><Ionicons name="sparkles-outline" size={19} color={C.purple}/><Text style={s.tipText}>Kendi YouTube bağlantılarını eklemek için sağ üstteki + düğmesine dokun.</Text></View>
      </> : <>
        <Text style={s.eyebrow}>{tab==='Listem'?'KİŞİSEL KÜTÜPHANE':'VAHFLIX KATALOĞU'}</Text>
        <Text style={s.pageTitle}>{tab==='Listem'?'Listem':'Keşfet'}</Text>
        <Text style={s.pageSubtitle}>{tab==='Listem'?'Kaydettiğin içerikler burada.':'YouTube bağlantılarını ekle, uygulama içinden izle.'}</Text>
        {tab==='Keşfet'&&<View style={s.filterRow}>{['Tümü','Film','Dizi'].map(x=><Pressable onPress={()=>setFilter(x)} key={x} style={[s.filterPill,filter===x&&s.filterPillActive]}><Text style={[s.filterText,filter===x&&s.filterTextActive]}>{x}</Text></Pressable>)}</View>}
        {library.length ? <View style={s.grid}>{library.map(item=><VideoCard key={item.id} item={item} onPress={()=>setPlaying(item)} saved={saved.includes(item.id)} onSave={()=>toggleSave(item.id)}/>)}</View> : <View style={s.empty}><View style={s.emptyIcon}><Ionicons name={tab==='Listem'?'bookmark-outline':'film-outline'} size={28} color={C.purple}/></View><Text style={s.emptyTitle}>{tab==='Listem'?'Henüz kayıt yok':'Henüz içerik eklenmedi'}</Text><Text style={s.emptyText}>{tab==='Listem'?'Beğendiğin içerikleri yer imine dokunarak burada topla.':'Bir YouTube video bağlantısı ekleyerek kütüphaneni oluştur.'}</Text>{tab!=='Listem'&&<Pressable onPress={()=>setShowAdd(true)} style={s.primaryButton}><Text style={s.primaryButtonText}>İçerik ekle</Text><Ionicons name="add" size={20} color="white"/></Pressable>}</View>}
      </>}
      <View style={{height:24}}/>
    </ScrollView>
    <View style={s.tabBar}>{[['Ana sayfa','home-outline'],['Keşfet','compass-outline'],['Listem','bookmark-outline']].map(([name,icon])=><Pressable key={name} onPress={()=>{setTab(name);setSearching(false);setQuery('');}} style={s.tabItem}><Ionicons name={tab===name?icon.replace('-outline',''):icon} size={21} color={tab===name?C.purple:C.muted}/><Text style={[s.tabLabel,tab===name&&s.tabLabelActive]}>{name}</Text></Pressable>)}</View>
    <AddModal visible={showAdd} onClose={()=>setShowAdd(false)} onAdd={addItem}/>
  </SafeAreaView>;
}
export default function App(){return <SafeAreaProvider><MainApp/></SafeAreaProvider>}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg}, header:{height:62,paddingHorizontal:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},brandRow:{flexDirection:'row',alignItems:'center',gap:9},logoMark:{width:29,height:29,borderRadius:10,backgroundColor:C.purple,alignItems:'center',justifyContent:'center'},brand:{color:C.white,fontSize:22,fontWeight:'900',letterSpacing:-1},headerActions:{flexDirection:'row',gap:8},iconButton:{width:40,height:40,borderRadius:14,backgroundColor:C.panel2,alignItems:'center',justifyContent:'center'},addIcon:{backgroundColor:C.purple},searchBox:{height:46,marginHorizontal:20,marginBottom:8,backgroundColor:C.panel,borderRadius:14,paddingHorizontal:14,flexDirection:'row',alignItems:'center',gap:10},searchInput:{color:C.white,flex:1,fontSize:14},scrollContent:{paddingBottom:10},eyebrow:{color:C.purple,fontSize:10,fontWeight:'800',letterSpacing:2,marginHorizontal:20,marginTop:18,marginBottom:12},hero:{marginHorizontal:18,minHeight:272,borderRadius:26,overflow:'hidden',padding:22,justifyContent:'center'},heroGlow:{position:'absolute',width:230,height:230,borderRadius:120,backgroundColor:'#8B5CF622',right:-42,top:-35},heroCopy:{width:'68%',zIndex:2},newTag:{flexDirection:'row',alignItems:'center',gap:7,marginBottom:12},liveDot:{width:7,height:7,borderRadius:4,backgroundColor:C.pink},newTagText:{color:'#D8C8FF',fontSize:9,fontWeight:'800',letterSpacing:1.4},heroTitle:{fontSize:39,lineHeight:42,fontWeight:'900',color:C.white,letterSpacing:-1.5},heroSub:{fontSize:12,lineHeight:18,color:'#C1C3D0',marginTop:9,maxWidth:235},watchButton:{marginTop:17,backgroundColor:'#F6F2FF',paddingHorizontal:15,height:39,borderRadius:13,alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:8},watchText:{fontSize:12,fontWeight:'800',color:'#171222'},heroEmoji:{position:'absolute',right:15,top:72,fontSize:80,transform:[{rotate:'-9deg'}]},heroLabel:{position:'absolute',right:18,bottom:14,color:'#FFFFFF1D',fontSize:23,fontWeight:'900',letterSpacing:3},sectionHead:{marginHorizontal:20,marginTop:27,marginBottom:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sectionTitle:{fontSize:19,fontWeight:'800',color:C.white},sectionCaption:{fontSize:11,color:C.muted,marginTop:4},seeAll:{fontSize:12,fontWeight:'700',color:'#B79AFF'},horizontalCards:{paddingHorizontal:18,gap:13,paddingBottom:3},card:{width:170},poster:{height:216,borderRadius:18,padding:13,justifyContent:'space-between',overflow:'hidden'},posterLarge:{height:260},posterTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},posterBadge:{overflow:'hidden',color:'#FFFFFFE8',fontSize:8,fontWeight:'900',letterSpacing:1,backgroundColor:'#FFFFFF20',paddingHorizontal:8,paddingVertical:5,borderRadius:7},posterEmoji:{fontSize:56,textAlign:'center'},posterBottom:{gap:3},posterTitle:{fontSize:15,fontWeight:'800',color:'white'},posterMeta:{fontSize:10,color:'#FFFFFFB8'},cardInfo:{flexDirection:'row',alignItems:'center',paddingTop:9,gap:4},cardTitle:{fontSize:13,fontWeight:'700',color:C.white},subtle:{fontSize:10,color:C.muted,marginTop:3},saveButton:{padding:5},tip:{marginHorizontal:20,marginTop:22,padding:14,borderRadius:16,backgroundColor:'#151326',borderWidth:1,borderColor:'#29203E',flexDirection:'row',alignItems:'center',gap:11},tipText:{flex:1,color:'#B9B5CB',fontSize:11,lineHeight:17},tabBar:{height:66,borderTopWidth:1,borderTopColor:C.line,backgroundColor:'#0C101A',flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingBottom:3},tabItem:{minWidth:76,alignItems:'center',gap:4},tabLabel:{fontSize:10,color:C.muted,fontWeight:'600'},tabLabelActive:{color:'#C6B1FF'},pageTitle:{fontSize:30,fontWeight:'900',color:C.white,marginHorizontal:20,letterSpacing:-.7},pageSubtitle:{fontSize:12,color:C.muted,marginHorizontal:20,marginTop:5,marginBottom:18},filterRow:{flexDirection:'row',gap:8,marginHorizontal:20,marginBottom:18},filterPill:{paddingHorizontal:16,paddingVertical:9,borderRadius:12,backgroundColor:C.panel},filterPillActive:{backgroundColor:'#37265E'},filterText:{color:C.muted,fontSize:12,fontWeight:'700'},filterTextActive:{color:'#D9C9FF'},grid:{paddingHorizontal:18,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:18},empty:{marginHorizontal:25,marginTop:62,alignItems:'center',padding:25,backgroundColor:C.panel,borderRadius:24,borderWidth:1,borderColor:C.line},emptyIcon:{width:58,height:58,borderRadius:20,backgroundColor:'#241D3B',alignItems:'center',justifyContent:'center',marginBottom:15},emptyTitle:{fontSize:17,fontWeight:'800',color:C.white},emptyText:{fontSize:12,lineHeight:18,color:C.muted,textAlign:'center',marginTop:8,marginBottom:17},primaryButton:{height:46,borderRadius:14,backgroundColor:C.purple,alignSelf:'stretch',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},primaryButtonText:{color:'white',fontSize:13,fontWeight:'800'},modalShade:{flex:1,backgroundColor:'#000A',justifyContent:'flex-end'},modalWrap:{width:'100%'},modalCard:{backgroundColor:'#101522',borderTopLeftRadius:27,borderTopRightRadius:27,paddingHorizontal:22,paddingTop:19,paddingBottom:Platform.OS==='ios'?35:25,borderTopWidth:1,borderColor:'#30364A'},rowBetween:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},modalTitle:{color:C.white,fontSize:21,fontWeight:'900'},fieldLabel:{color:C.muted,fontSize:9,fontWeight:'800',letterSpacing:1.3,marginTop:19,marginBottom:9},segmentRow:{flexDirection:'row',gap:8},segment:{flex:1,height:42,borderRadius:12,backgroundColor:C.panel2,alignItems:'center',justifyContent:'center'},segmentActive:{backgroundColor:'#3A2864'},segmentText:{color:C.muted,fontWeight:'700',fontSize:13},segmentTextActive:{color:'#E0D3FF'},input:{height:47,borderRadius:12,backgroundColor:C.panel2,color:C.white,paddingHorizontal:13,fontSize:13,borderWidth:1,borderColor:'#252B3C'},formHint:{color:'#8790A4',fontSize:10,lineHeight:15,marginTop:10},playerHeader:{height:54,paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},playerHeaderTitle:{fontSize:10,color:C.muted,fontWeight:'800',letterSpacing:1.4},videoFrame:{width:'100%',aspectRatio:16/9,backgroundColor:'#000'},playerInfo:{padding:20},playerTitle:{fontSize:22,color:C.white,fontWeight:'900'},quality:{flexDirection:'row',alignItems:'center',backgroundColor:C.panel2,borderRadius:10,paddingHorizontal:10,paddingVertical:8},qualityText:{fontSize:10,color:C.white,fontWeight:'700'},description:{color:'#BCC2D1',fontSize:13,lineHeight:20,marginTop:17},playerNote:{color:'#788196',fontSize:10,lineHeight:15,marginTop:18,paddingTop:14,borderTopWidth:1,borderColor:C.line}
});