import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StockSummaryData, UserBranch } from '@/app/Types/user.types';
import { UserStorage } from '@/lib/userStorage';
import DashboardService from '@/app/services/DashboardService';

import { useColorScheme } from 'nativewind';
import { getScreenOptions } from '@/components/shared/headerOption';

// Dashboard menu items - Dynamic configuration
const dashboardMenuItems = [
    { id: 'purchase', label: 'PURCHASE', icon: '🛒', route: '/pages/purchase' },
    { id: 'sales', label: 'SALES', icon: '💵', route: '/pages/sales' }
];

export default function Dashboard() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [currentBranch, setSelectedBranch] = React.useState<UserBranch | null>(null);
    const [dateTime, setDateTime] = useState(new Date());
    const [dashboardData, setDashboardData] = React.useState<StockSummaryData[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    React.useEffect(() => {
        loadSelectedBrancheData();
    }, []);

    const loadSelectedBrancheData = async () => {
        try {
            const selectedBranch = await UserStorage.getSelectedBranch();

            if (selectedBranch?.companyId != null) {
                setSelectedBranch(selectedBranch);
                const response = await DashboardService.getDashboardData(selectedBranch.companyId, selectedBranch.processDate);
                if (response.statusCode == 200) {
                    setDashboardData(await UserStorage.getStockSummary());
                }
            } else {
                console.warn('No branch data found. Redirecting to login...');
            }
        } catch (error) {
            console.error('Error loading branches:', error);
        }
    };

    function handleMenuPress(path: string) {
        if (path) {
            console.log("path", path);
            router.push(path as never);
        }
    }

    return (
        <>
            <Stack.Screen options={getScreenOptions(colorScheme ?? 'light', { showProfileButton: true })} />
            <View className="flex-1 bg-background" style={{ marginTop: 100 }}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <Text className="text-foreground text-3xl font-bold mb-1">Dashboard</Text>
                    </View>

                    <View style={styles.contentContainer}>
                        {/* Company Info Card */}
                        <View className="bg-card border border-border rounded-2xl p-5 mb-6 shadow-sm">
                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <View className="w-11 h-11 rounded-full bg-muted justify-center items-center mr-3">
                                        <Text style={styles.infoIcon}>🏢</Text>
                                    </View>
                                    <View style={styles.infoTextContainer}>
                                        <Text className="text-muted-foreground text-xs font-medium mb-0.5">Company</Text>
                                        <Text className="text-foreground text-sm font-semibold">{currentBranch?.companyName}</Text>
                                    </View>
                                </View>
                                <View className="w-px h-10 bg-border mx-3" />
                                <View style={styles.infoItem}>
                                    <View className="w-11 h-11 rounded-full bg-muted justify-center items-center mr-3">
                                        <Text style={styles.infoIcon}>📍</Text>
                                    </View>
                                    <View style={styles.infoTextContainer}>
                                        <Text className="text-muted-foreground text-xs font-medium mb-0.5">Location</Text>
                                        <Text className="text-foreground text-sm font-semibold">{currentBranch?.locationName}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="h-px bg-border my-4" />

                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <View className="w-11 h-11 rounded-full bg-muted justify-center items-center mr-3">
                                        <Text style={styles.infoIcon}>📅</Text>
                                    </View>
                                    <View style={styles.infoTextContainer}>
                                        <Text className="text-muted-foreground text-xs font-medium mb-0.5">Date</Text>
                                        <Text className="text-foreground text-sm font-semibold">{formatDate(dateTime)}</Text>
                                    </View>
                                </View>
                                <View className="w-px h-10 bg-border mx-3" />
                                <View style={styles.infoItem}>
                                    <View className="w-11 h-11 rounded-full bg-muted justify-center items-center mr-3">
                                        <Text style={styles.infoIcon}>🕐</Text>
                                    </View>
                                    <View style={styles.infoTextContainer}>
                                        <Text className="text-muted-foreground text-xs font-medium mb-0.5">Time</Text>
                                        <Text className="text-foreground text-sm font-semibold">{formatTime(dateTime)}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Summary Cards */}
                        <View style={styles.summarySection}>
                            <Text className="text-foreground text-xl font-bold mb-4">Today's Overview</Text>
                            <View style={styles.summaryCards}>
                                <View className="flex-1 bg-card border border-border rounded-2xl p-5 shadow-sm">
                                    <View style={styles.cardHeader}>
                                        <View className="w-10 h-10 rounded-xl bg-muted justify-center items-center">
                                            <Text style={styles.cardIcon}>💰</Text>
                                        </View>
                                        <Text className="text-muted-foreground text-xs font-bold tracking-wider">SALES</Text>
                                    </View>
                                    <Text className="text-foreground text-xl font-extrabold mb-1">
                                        LKR {dashboardData?.[0]?.gtNetPurchaseValue?.toLocaleString('en-LK') ?? '0.00'}
                                    </Text>
                                    <Text className="text-muted-foreground text-xs font-medium">Today's Revenue</Text>
                                </View>

                                <View className="flex-1 bg-card border border-border rounded-2xl p-5 shadow-sm ml-3">
                                    <View style={styles.cardHeader}>
                                        <View className="w-10 h-10 rounded-xl bg-muted justify-center items-center">
                                            <Text style={styles.cardIcon}>🛒</Text>
                                        </View>
                                        <Text className="text-muted-foreground text-xs font-bold tracking-wider">PURCHASES</Text>
                                    </View>
                                    <Text className="text-foreground text-xl font-extrabold mb-1">
                                        LKR {dashboardData?.[0]?.gtSalesValue?.toLocaleString('en-LK') ?? '0.00'}
                                    </Text>
                                    <Text className="text-muted-foreground text-xs font-medium">Today's Expenses</Text>
                                </View>
                            </View>
                        </View>

                        {/* Menu Section */}
                        <View style={styles.menuSection}>
                            <Text className="text-foreground text-xl font-bold mb-4">Quick Actions</Text>
                            <View style={styles.menuGrid}>
                                {dashboardMenuItems.map((item) => (
                                    <Pressable
                                        key={item.id}
                                        style={({ pressed }) => [
                                            styles.menuTile,
                                            pressed && styles.menuTilePressed
                                        ]}
                                        onPress={() => handleMenuPress(item.route)}
                                    >
                                        <View className="flex-1 bg-muted rounded-2xl justify-center items-center mb-2 shadow-sm">
                                            {item.icon && <Text style={styles.menuIcon}>{item.icon}</Text>}
                                        </View>
                                        <Text className="text-foreground text-xs font-semibold text-center">{item.label}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    headerContainer: {
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    contentContainer: {
        paddingHorizontal: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoIcon: {
        fontSize: 20,
    },
    infoTextContainer: {
        flex: 1,
    },
    summarySection: {
        marginBottom: 24,
    },
    summaryCards: {
        flexDirection: 'row',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardIcon: {
        fontSize: 20,
    },
    menuSection: {
        marginBottom: 24,
    },
    menuGrid: {
        justifyContent:'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 45,
    },
    menuTile: {
        width: '30%',
        aspectRatio: 1,
        marginBottom: 12,
    },
    menuTilePressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }],
    },
    menuIcon: {
        fontSize: 32,
    },
});