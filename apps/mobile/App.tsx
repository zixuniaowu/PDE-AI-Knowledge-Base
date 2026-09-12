import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import content from "./src/data/content.json";

type UseCase = {
  id: string;
  title: string;
  summary: string;
  status: string;
  body: string;
};

type Domain = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  status: string;
  useCases: UseCase[];
};

type Phase = {
  id: string;
  method: string;
  order: number;
  title: string;
  status: string;
  body: string;
};

const domain = content.domains as Domain[];
const phases = content.process.phases as Phase[];

const statusLabel: Record<string, string> = {
  draft: "ドラフト",
  reviewed: "レビュー済",
  approved: "承認済",
};

type Screen =
  | { name: "home" }
  | { name: "domain"; item: Domain }
  | { name: "usecase"; item: UseCase; domain: Domain }
  | { name: "process" }
  | { name: "phase"; item: Phase };

export default function App() {
  const [stack, setStack] = useState<Screen[]>([{ name: "home" }]);
  const screen = stack[stack.length - 1];
  const push = (s: Screen) => setStack((prev) => [...prev, s]);
  const pop = () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

  return (
    <View style={styles.root}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        {stack.length > 1 && (
          <TouchableOpacity onPress={pop} hitSlop={12}>
            <Text style={styles.back}>‹ 戻る</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {screen.name === "home" && "PDE Knowledge"}
          {screen.name === "domain" && `${screen.item.icon ?? "📦"} ${screen.item.name}`}
          {screen.name === "usecase" && screen.item.title}
          {screen.name === "process" && "工程"}
          {screen.name === "phase" && `${screen.item.method} · ${screen.item.title}`}
        </Text>
      </View>

      {screen.name === "home" && <HomeScreen push={push} />}

      {screen.name === "domain" && (
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyInner}>
          <Text style={styles.desc}>{screen.item.description}</Text>
          <Text style={styles.sectionLabel}>ユースケース</Text>
          {screen.item.useCases.map((uc) => (
            <Card
              key={uc.id}
              title={uc.title}
              subtitle={uc.summary}
              badge={statusLabel[uc.status] ?? uc.status}
              onPress={() => push({ name: "usecase", item: uc, domain: screen.item })}
            />
          ))}
          {screen.item.useCases.length === 0 && (
            <Text style={styles.empty}>まだユースケースがありません</Text>
          )}
        </ScrollView>
      )}

      {screen.name === "usecase" && (
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyInner}>
          <Text style={styles.badge}>{statusLabel[screen.item.status]}</Text>
          <Body text={screen.item.body} />
        </ScrollView>
      )}

      {screen.name === "process" && (
        <FlatList
          style={styles.body}
          contentContainerStyle={styles.bodyInner}
          data={phases}
          keyExtractor={(p) => `${p.method}/${p.id}`}
          renderItem={({ item }) => (
            <Card
              title={`${item.order}. ${item.title}`}
              subtitle={`${item.method} · ${statusLabel[item.status] ?? item.status}`}
              onPress={() => push({ name: "phase", item })}
            />
          )}
        />
      )}

      {screen.name === "phase" && (
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyInner}>
          <Text style={styles.badge}>{statusLabel[screen.item.status]}</Text>
          <Body text={screen.item.body} />
        </ScrollView>
      )}

      {screen.name === "home" && (
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => push({ name: "process" })}>
            <Text style={styles.footerLink}>🔁 工程一覧を見る</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://github.com/zixuniaowu/PDE-AI-Knowledge-Base")
            }
          >
            <Text style={styles.footerLink}>GitHub で貢献する</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function HomeScreen({ push }: { push: (s: Screen) => void }) {
  return (
    <FlatList
      style={styles.body}
      contentContainerStyle={styles.bodyInner}
      ListHeaderComponent={
        <View>
          <Text style={styles.heroTitle}>領域 × 工程</Text>
          <Text style={styles.desc}>
            あらゆる領域と開発工程に AI を組み込む方法を、専門家が共同で育てるナレッジベース。
          </Text>
          <Text style={styles.sectionLabel}>領域</Text>
        </View>
      }
      data={domain}
      keyExtractor={(d) => d.id}
      renderItem={({ item }) => (
        <Card
          title={`${item.icon ?? "📦"} ${item.name}`}
          subtitle={item.description}
          badge={statusLabel[item.status] ?? item.status}
          onPress={() => push({ name: "domain", item })}
        />
      )}
    />
  );
}

function Card({
  title,
  subtitle,
  badge,
  onPress,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {badge && <Text style={styles.badge}>{badge}</Text>}
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle ? <Text style={styles.cardSub}>{subtitle}</Text> : null}
    </TouchableOpacity>
  );
}

/** Markdown 風の本文を簡易表示（見出し・箇条書き・コードブロック対応） */
function Body({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <View>
      {lines.map((line, i) => {
        if (line.startsWith("```")) {
          return (
            <Text key={i} style={styles.codeLine}>
              {line.replace("```", "")}
            </Text>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <Text key={i} style={styles.h2}>
              {line.slice(3)}
            </Text>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <Text key={i} style={styles.h3}>
              {line.slice(4)}
            </Text>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <Text key={i} style={styles.li}>
              • {line.slice(2)}
            </Text>
          );
        }
        if (/^\d+\.\s/.test(line)) {
          return (
            <Text key={i} style={styles.li}>
              {line}
            </Text>
          );
        }
        if (line.trim() === "") return null;
        return (
          <Text key={i} style={styles.p}>
            {line.replace(/[*_`#>[\]()]/g, "")}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingTop: 54,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0f172a",
  },
  headerTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  back: { color: "#7dd3fc", fontSize: 14, marginBottom: 4 },
  body: { flex: 1 },
  bodyInner: { padding: 16, paddingBottom: 40 },
  heroTitle: { fontSize: 24, fontWeight: "800", color: "#0f172a", marginBottom: 6 },
  desc: { color: "#475569", fontSize: 14, lineHeight: 21, marginBottom: 8 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a", marginTop: 2 },
  cardSub: { fontSize: 13, color: "#475569", marginTop: 4, lineHeight: 19 },
  badge: {
    alignSelf: "flex-start",
    fontSize: 11,
    color: "#2563eb",
    backgroundColor: "#dbeafe",
    borderRadius: 999,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  empty: { color: "#94a3b8", fontSize: 13 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  footerLink: { color: "#2563eb", fontSize: 14 },
  h2: { fontSize: 18, fontWeight: "800", color: "#0f172a", marginTop: 18, marginBottom: 6 },
  h3: { fontSize: 15, fontWeight: "700", color: "#0f172a", marginTop: 14, marginBottom: 4 },
  p: { fontSize: 14, lineHeight: 22, color: "#1e293b", marginBottom: 4 },
  li: { fontSize: 14, lineHeight: 22, color: "#1e293b", marginLeft: 8 },
  codeLine: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#334155",
    backgroundColor: "#e2e8f0",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 2,
  },
});
