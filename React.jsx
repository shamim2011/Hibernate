// party_menu_app.jsx
// Party Menu Selection App – React Native CLI Version
// Requirements: Functional Components, Hooks, Mock Data, React Navigation

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  SafeAreaView,
} from "react-native";

// --- MOCK DATA (add more dishes for other categories as needed) ---
const DISHES = [
  // MAIN COURSE (Veg)
  ...Array.from({ length: 30 }).map((_, i) => ({
    categoryId: 1,
    mealType: "MAIN COURSE",
    type: "VEG",
    description:
      "Paneer cubes in spicy onion gravy with onions and capsicum cubes.",
    image:
      "https://storage.googleapis.com/chefkartimages/customer_app_assets/star_chef/north_indian.png",
    category: {
      id: 1,
      name: "North Indian",
      image:
        "https://storage.googleapis.com/chefkartimages/customer_app_assets/star_chef/north_indian.png",
      isRecommendedForMealSuggestion: true,
    },
    dishType: "CURRY",
    forChefit: true,
    forParty: true,
    nameHi: "",
    nameBn: "",
    id: i + 1,
    name: `Kadhai Paneer ${i + 1}`,
  })),
  // Add example Starters, Desserts, Sides
  {
    categoryId: 2,
    mealType: "STARTER",
    type: "NON-VEG",
    description: "Juicy chicken marinated in spices, grilled to perfection.",
    image:
      "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400",
    category: {
      id: 2,
      name: "Indian Starter",
      image:
        "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400",
    },
    dishType: "GRILL",
    forChefit: true,
    forParty: true,
    nameHi: "",
    nameBn: "",
    id: 101,
    name: "Tandoori Chicken",
  },
  {
    categoryId: 3,
    mealType: "DESSERT",
    type: "VEG",
    description: "Traditional Indian milk pudding with saffron & pistachio.",
    image:
      "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400",
    category: {
      id: 3,
      name: "Desserts",
      image:
        "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400",
    },
    dishType: "DESSERT",
    forChefit: true,
    forParty: true,
    nameHi: "",
    nameBn: "",
    id: 201,
    name: "Kesar Phirni",
  },
  {
    categoryId: 4,
    mealType: "SIDES",
    type: "VEG",
    description: "Soft Indian bread made from wheat flour.",
    image:
      "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400",
    category: {
      id: 4,
      name: "Sides",
      image:
        "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400",
    },
    dishType: "BREAD",
    forChefit: true,
    forParty: true,
    nameHi: "",
    nameBn: "",
    id: 301,
    name: "Phulka Roti",
  },
];

// Mock ingredient data
const INGREDIENTS = {
  "Kadhai Paneer 1": [
    { name: "Paneer", qty: "200g" },
    { name: "Onion", qty: "1" },
    { name: "Capsicum", qty: "1/2" },
    { name: "Spices", qty: "to taste" },
  ],
  "Tandoori Chicken": [
    { name: "Chicken", qty: "250g" },
    { name: "Yogurt", qty: "2 tbsp" },
    { name: "Spices", qty: "to taste" },
  ],
  "Kesar Phirni": [
    { name: "Milk", qty: "500ml" },
    { name: "Rice", qty: "50g" },
    { name: "Saffron", qty: "a few strands" },
    { name: "Sugar", qty: "to taste" },
  ],
  "Phulka Roti": [
    { name: "Wheat Flour", qty: "100g" },
    { name: "Water", qty: "as needed" },
    { name: "Salt", qty: "to taste" },
  ],
  // Default/mock for all others
};

// --- CATEGORY TABS ---
const MEAL_TYPES = [
  { key: "STARTER", label: "Starter" },
  { key: "MAIN COURSE", label: "Main Course" },
  { key: "DESSERT", label: "Dessert" },
  { key: "SIDES", label: "Sides" },
];

// --- MAIN APP ---
export default function PartyMenuApp() {
  // Navigation: manual state for two screens
  const [screen, setScreen] = useState("menu"); // "menu" | "ingredient"
  const [ingredientDish, setIngredientDish] = useState(null);

  // UI state
  const [selectedTab, setSelectedTab] = useState("MAIN COURSE");
  const [search, setSearch] = useState("");
  const [veg, setVeg] = useState(true);
  const [nonVeg, setNonVeg] = useState(true);

  // Selection state
  const [selectedDishes, setSelectedDishes] = useState({}); // {dishId: true}

  // --- FILTERED DISHES ---
  const filteredDishes = useMemo(() => {
    return DISHES.filter(
      (dish) =>
        dish.mealType === selectedTab &&
        (veg && dish.type === "VEG" || nonVeg && dish.type === "NON-VEG") &&
        dish.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [selectedTab, search, veg, nonVeg]);

  // --- CATEGORY COUNTS ---
  const categoryCounts = useMemo(() => {
    const counts = {};
    Object.values(MEAL_TYPES).forEach((cat) => (counts[cat.key] = 0));
    Object.keys(selectedDishes).forEach((id) => {
      const dish = DISHES.find((d) => d.id === +id);
      if (dish) counts[dish.mealType] = (counts[dish.mealType] || 0) + 1;
    });
    return counts;
  }, [selectedDishes]);

  // --- TOTAL COUNT ---
  const totalSelected = Object.keys(selectedDishes).length;

  // --- HANDLERS ---
  const handleAddRemove = (dishId) => {
    setSelectedDishes((prev) =>
      prev[dishId]
        ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== String(dishId)))
        : { ...prev, [dishId]: true }
    );
  };

  const openIngredient = (dish) => {
    setIngredientDish(dish);
    setScreen("ingredient");
  };

  const closeIngredient = () => {
    setIngredientDish(null);
    setScreen("menu");
  };

  // --- RENDERERS ---
  const renderDish = ({ item }) => (
    <View style={styles.dishCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.dishTitle}>
          {item.name}{" "}
          {item.type === "VEG" ? (
            <Text style={styles.vegDot}>🟢</Text>
          ) : (
            <Text style={styles.nonVegDot}>🔴</Text>
          )}
        </Text>
        <Text style={styles.dishDesc}>{item.description}</Text>
        <TouchableOpacity onPress={() => openIngredient(item)}>
          <Text style={styles.ingredientLink}>🍋 Ingredient</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: item.image }}
        style={styles.dishImage}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={[
          styles.addRemoveBtn,
          selectedDishes[item.id] ? styles.removeBtn : styles.addBtn,
        ]}
        onPress={() => handleAddRemove(item.id)}
      >
        <Text style={{ color: selectedDishes[item.id] ? "#D0021B" : "#088C08" }}>
          {selectedDishes[item.id] ? "Remove" : "Add +"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // --- MAIN MENU SCREEN ---
  if (screen === "menu") {
    return (
      <SafeAreaView style={styles.container}>
        {/* Search bar */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search dish for your party..."
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Category Tabs */}
        <View style={styles.tabsContainer}>
          {MEAL_TYPES.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                selectedTab === tab.key && styles.activeTab,
              ]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabLabel,
                  selectedTab === tab.key && styles.activeTabLabel,
                ]}
              >
                {tab.label}
              </Text>
              <Text style={styles.tabCountText}>
                {categoryCounts[tab.key] > 0 ? ` (${categoryCounts[tab.key]})` : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Veg/Non-Veg Filters */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              veg && styles.filterBtnSelected,
            ]}
            onPress={() => setVeg((v) => !v)}
          >
            <Text style={{ color: veg ? "#088C08" : "#888" }}>Veg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              nonVeg && styles.filterBtnSelected,
            ]}
            onPress={() => setNonVeg((v) => !v)}
          >
            <Text style={{ color: nonVeg ? "#D0021B" : "#888" }}>Non-Veg</Text>
          </TouchableOpacity>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>
          {MEAL_TYPES.find((t) => t.key === selectedTab)?.label} Selected (
          {categoryCounts[selectedTab] || 0})
        </Text>

        {/* Dish List */}
        <FlatList
          data={filteredDishes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDish}
          contentContainerStyle={{ paddingBottom: 90 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 32, color: "#888" }}>
              No dishes found.
            </Text>
          }
        />

        {/* Footer: Total and Continue */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Total Dish Selected {totalSelected}
          </Text>
          <TouchableOpacity style={styles.continueBtn}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- INGREDIENT DETAIL SCREEN ---
  if (screen === "ingredient" && ingredientDish) {
    const ingredients =
      INGREDIENTS[ingredientDish.name] ||
      [
        { name: "Ingredient 1", qty: "01 Pc" },
        { name: "Ingredient 2", qty: "12g" },
        { name: "Tomato", qty: "01 Pc" },
      ];
    return (
      <SafeAreaView style={styles.ingredientScreen}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={closeIngredient}>
            <Text style={{ fontSize: 22, margin: 6 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.ingredientHeader}>Ingredient list</Text>
        </View>
        <View style={styles.ingredientDetailContainer}>
          <Image
            source={{ uri: ingredientDish.image }}
            style={styles.ingredientDishImage}
            resizeMode="cover"
          />
          <Text style={styles.ingredientDishTitle}>{ingredientDish.name}</Text>
          <Text style={styles.ingredientDishDesc}>
            {ingredientDish.description}
          </Text>
          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Ingredients</Text>
          <View style={styles.ingredientList}>
            {ingredients.map((ing, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 4,
                }}
              >
                <Text style={{ fontSize: 16 }}>{ing.name}</Text>
                <Text style={{ fontSize: 16, color: "#888" }}>{ing.qty}</Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfcfc",
  },
  searchBarContainer: {
    padding: 12,
    backgroundColor: "#fcfcfc",
  },
  searchInput: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    marginHorizontal: 2,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomColor: "#FF4D00",
    backgroundColor: "#fff2e6",
    borderRadius: 8,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#888",
  },
  activeTabLabel: {
    color: "#FF4D00",
  },
  tabCountText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#FF4D00",
    marginLeft: 3,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  filterBtn: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginLeft: 8,
    backgroundColor: "#fff",
  },
  filterBtnSelected: {
    borderColor: "#FF4D00",
    backgroundColor: "#fff2e6",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    margin: 10,
    color: "#444",
  },
  dishCard: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dishTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 2,
    color: "#1a1a1a",
  },
  dishDesc: {
    color: "#666",
    fontSize: 13,
    marginBottom: 5,
  },
  ingredientLink: {
    color: "#FF4D00",
    fontWeight: "bold",
    marginVertical: 1,
  },
  dishImage: {
    width: 66,
    height: 66,
    borderRadius: 40,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: "#eee",
  },
  addRemoveBtn: {
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    marginLeft: 4,
    marginRight: 2,
  },
  addBtn: {
    borderColor: "#088C08",
    backgroundColor: "#e6f8e6",
  },
  removeBtn: {
    borderColor: "#D0021B",
    backgroundColor: "#ffe6e6",
  },
  vegDot: {
    fontSize: 13,
  },
  nonVegDot: {
    fontSize: 13,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 10,
    shadowOpacity: 0.14,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
  },
  footerText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#444",
  },
  continueBtn: {
    backgroundColor: "#FF4D00",
    borderRadius: 10,
    paddingHorizontal: 32,
    paddingVertical: 12,
    alignItems: "center",
  },
  continueBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  ingredientScreen: {
    flex: 1,
    backgroundColor: "#fcfcfc",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  ingredientHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 6,
    color: "#FF4D00",
  },
  ingredientDetailContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 12,
    padding: 18,
    alignItems: "center",
    elevation: 3,
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  ingredientDishImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  ingredientDishTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#222",
    marginBottom: 4,
    textAlign: "center",
  },
  ingredientDishDesc: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  ingredientList: {
    width: "100%",
    marginTop: 8,
  },
});