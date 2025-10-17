import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { BranchData } from '@/app/Types/User.types';

// Dashboard menu items - Dynamic configuration
const dashboardMenuItems = [
    { id: 'purchase', label: 'PURCHASE', icon: '🛒',  route: '/pages/purchase', color: '#f59e0b' },
    { id: 'sales', label: 'SALES', icon: '💵', route: '/pages/sales', color: '#f59e0b' },
    { id: 'purchase_return', label: 'PURCHASE\nRETURN', icon: '', route: '', color: '#f59e0b' },
    { id: 'print_receipt', label: 'PRINT\nRECEIPT', icon: '', route: '', color: '#f59e0b' },
    { id: 'stock_transfer', label: 'STOCK\nTRANSFER', icon: '', route: '', color: '#f59e0b' },
    { id: 'cancel_stock', label: 'CANCEL STOCK\nTRANSFER', icon: '', route: '', color: '#f59e0b' },
    { id: 'gross_qty', label: 'GROSS QTY\nADJUSTMENT', icon: '', route: '', color: '#f59e0b' },
    { id: 'cash_book', label: 'CASH BOOK', icon: '', route: '', color: '#f59e0b' },
    { id: 'reports', label: 'REPORTS', icon: '', route: '', color: '#f59e0b' },
    { id: 'day_close', label: 'DAY CLOSE', icon: '', route: '', color: '#f59e0b' },
    { id: 'stock', label: 'STOCK', icon: '', route: '', color: '#f59e0b' },
    { id: 'maintenance', label: 'MAINTENANCE', icon: '', route: '', color: '#f59e0b' },
    { id: 'security', label: 'SECURITY', icon: '', route: '', color: '#f59e0b' },
];

export default function Dashboard() {
    const router = useRouter();
    const [branches, setSelectedBranch] = React.useState<BranchData[]>([]);
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;

    }; const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Load dashboard data based on selected branch
    React.useEffect(() => {
        // Replace with actual API call using selected branch ID
        // fetchDashboardData(selectedBranchId).then(data => setDashboardData(data));
    }, []);

    function handleMenuPress(path:string) {
        router.push(path as never);
    }

    function handleProfilePress() {
        router.push('/pages/profile');
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <Pressable onPress={handleProfilePress} style={styles.profileButton}>
                    <View style={styles.profileIcon}>
                        <Text style={styles.profileIconText}>👤</Text>
                    </View>
                </Pressable>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Company Info Section */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoIcon}>🏢</Text>
                            <Text style={styles.infoText}>{dashboardData.companyName}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoIcon}>📅</Text>
                            <Text style={styles.infoText}>{formatDate(dateTime)}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoIcon}>📍</Text>
                            <Text style={styles.infoText}>{dashboardData.branchName}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoIcon}>🕐</Text>
                            <Text style={styles.infoText}>{formatTime(dateTime)}</Text>
                        </View>
                    </View>
                </View>

                {/* Summary Cards - Fixed */}
                <View style={styles.summaryCards}>
                    <View style={[styles.summaryCard, styles.salesCard]}>
                        <Text style={styles.summaryTitle}>TODAY'S{'\n'}SALE</Text>
                        <Text style={styles.summaryAmount}>
                            RS. {dashboardData.todaySale.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                    </View>
                    <View style={[styles.summaryCard, styles.purchaseCard]}>
                        <Text style={styles.summaryTitle}>TODAY'S{'\n'}PURCHASES</Text>
                        <Text style={styles.summaryAmount}>
                            RS. {dashboardData.todayPurchase.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                    </View>
                </View>

                {/* Dynamic Menu Grid */}
                <View style={styles.menuGrid}>
                    {dashboardMenuItems.map((item) => (
                        <Pressable
                            key={item.id}
                            style={styles.menuTile}
                            onPress={() => handleMenuPress(item.route)}
                        >
                            <View style={[styles.menuTileInner, { backgroundColor: item.color }]}>
                                {item.icon && <Text style={styles.menuIcon}>{item.icon}</Text>}
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d97706',
    },
    profileButton: {
        padding: 4,
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileIconText: {
        fontSize: 24,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    infoSection: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    summaryCards: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    summaryCard: {
        flex: 1,
        borderRadius: 16,
        padding: 20,
        minHeight: 120,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    salesCard: {
        backgroundColor: '#22c55e',
    },
    purchaseCard: {
        backgroundColor: '#d97706',
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        lineHeight: 22,
    },
    summaryAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 8,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    menuTile: {
        width: '30.5%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    menuTileInner: {
        width: '100%',
        height: '70%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    menuIcon: {
        fontSize: 32,
    },
    menuLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 8,
        textTransform: 'uppercase',
        lineHeight: 12,
    },
});