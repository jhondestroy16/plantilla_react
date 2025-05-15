import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
    IoChevronForwardOutline,
    IoAlertCircleOutline,
    IoReloadOutline,
    IoHomeOutline,
} from "react-icons/io5";
import * as IoIcons from "react-icons/io5";
import * as FaIcons from "react-icons/fa";
import usePermissions from "@/hooks/usePermissions";

const Sidebar = ({ user, closeSidebar }) => {
    const [navigation, setNavigation] = useState([]);
    const [error, setError] = useState(null);
    const [expandedMenus, setExpandedMenus] = useState({});
    const { can } = usePermissions();

    const hasPermissionForItem = (item) => {
        if (!item.permissions || item.permissions.length === 0) {
            return can(`ver ${item.name.toLowerCase()}`);
        }
        return item.permissions.some((permission) => can(permission));
    };

    useEffect(() => {
        fetchNavigation();
    }, []);

    const fetchNavigation = async () => {
        try {
            setError(null);
            const response = await axios.get(route("api.navigation"));

            if (response.data.success) {
                const filteredData = response.data.data.map(section => ({
                    ...section,
                    items: section.items
                        .filter(item => {
                            const hasPermission = hasPermissionForItem(item);
                            const hasValidChildren = hasValidSubItems(item);
                            const hasValidLink = item.href && item.href !== '#';
                            return hasPermission && (hasValidChildren || hasValidLink);
                        })
                        .map(item => cleanItem(item))
                })).filter(section => section.items.length > 0);

                setNavigation(filteredData);
            } else {
                throw new Error(response.data.message || "Error al cargar el menú");
            }
        } catch (err) {
            console.error("Error fetching navigation:", err);
            setError(err.message);
            setNavigation(getFallbackNavigation());
        }
    };

    const cleanItem = (item) => {
        if (!item.subItems || item.subItems.length === 0) {
            return { ...item, subItems: null };
        }

        const cleanedSubItems = item.subItems
            .filter(subItem => {
                const hasPermission = hasPermissionForItem(subItem);
                const hasValidChildren = hasValidSubItems(subItem);
                const hasValidLink = subItem.href && subItem.href !== '#';
                return hasPermission && (hasValidChildren || hasValidLink);
            })
            .map(subItem => cleanItem(subItem));

        return {
            ...item,
            subItems: cleanedSubItems.length > 0 ? cleanedSubItems : null
        };
    };

    const hasValidSubItems = (item) => {
        if (!item.subItems || item.subItems.length === 0) return false;
        return item.subItems.some(subItem => {
            const hasPermission = hasPermissionForItem(subItem);
            const hasValidChildren = hasValidSubItems(subItem);
            const hasValidLink = subItem.href && subItem.href !== '#';
            return hasPermission && (hasValidChildren || hasValidLink);
        });
    };

    const retryFetch = () => {
        fetchNavigation();
    };

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const handleMenuClick = (item, event) => {
        if (item.subItems && item.subItems.length > 0) {
            event.preventDefault();
            toggleMenu(item.id);
        } else {
            closeSidebar?.();
        }
    };

    const getIconComponent = (iconName) => {
        if (!iconName) return null;
        const cleanedName = iconName.trim();
        return IoIcons[cleanedName] || FaIcons[cleanedName] || null;
    };

    const MenuItem = ({ item, level = 0 }) => {
        const Icon = getIconComponent(item.icon);
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedMenus[item.id];
        const isActive = item.active || (hasSubItems && isExpanded);

        if (hasSubItems) {
            return (
                <div className={`mb-1 ${level > 0 ? 'ml-2' : ''}`}>
                    <div
                        onClick={(e) => handleMenuClick(item, e)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                            isActive
                                ? "bg-[#4a322f] text-white"
                                : "text-gray-300 hover:bg-[#5a3b37] hover:text-white"
                        }`}
                    >
                        <div className="flex items-center">
                            {Icon && <Icon className="w-5 h-5 mr-3" />}
                            <span className="font-medium">{item.name}</span>
                        </div>
                        <IoChevronForwardOutline
                            className={`w-4 h-4 transform transition-transform ${
                                isExpanded ? "rotate-90" : ""
                            }`}
                        />
                    </div>

                    {isExpanded && (
                        <div className={`mt-1 space-y-1 ${level > 0 ? 'ml-4' : 'ml-8'}`}>
                            {item.subItems.map((subItem) => (
                                <MenuItem key={`subitem-${subItem.id}`} item={subItem} level={level + 1} />
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Link
                href={item.href}
                className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                    item.active
                        ? "bg-[#4a322f] text-white font-medium"
                        : "text-gray-300 hover:bg-[#5a3b37] hover:text-white"
                }`}
                onClick={closeSidebar}
            >
                <div className="flex items-center">
                    {Icon && <Icon className="w-5 h-5 mr-3" />}
                    <span>{item.name}</span>
                </div>
            </Link>
        );
    };

    return (
        <div className="flex h-full flex-col bg-[#3b2522] shadow-lg">
            {/* Cabecera */}
            <div className="flex h-16 shrink-0 items-center px-4 bg-[#3b2522] border-b border-[#4a322f]">
                <Link href="/" className="flex items-center">
                    <span className="text-xl font-semibold text-white">Web Caffa</span>
                </Link>
            </div>

            {/* Mostrar error si ocurre */}
            {error && (
                <div className="flex flex-col p-4 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center text-red-600 dark:text-red-300">
                        <IoAlertCircleOutline className="mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                    <button
                        onClick={retryFetch}
                        className="mt-2 flex items-center justify-center text-sm text-red-700 dark:text-red-200 hover:underline"
                    >
                        <IoReloadOutline className="mr-1" />
                        Reintentar
                    </button>
                </div>
            )}

            {/* Menú de navegación */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 bg-[#3b2522]">
                {navigation.length > 0 ? (
                    navigation.map((section) => (
                        <div key={`section-${section.group}`} className="mb-8">
                            <h3 className="px-2 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                {section.group}
                            </h3>
                            <div className="mt-2 space-y-1">
                                {section.items.map((item) => (
                                    <MenuItem key={`item-${item.id}`} item={item} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-300 py-4">
                        No tienes acceso a ningún módulo
                    </div>
                )}
            </nav>
        </div>
    );
};

// Menú de respaldo
const getFallbackNavigation = () => {
    return [
        {
            group: "Menú Principal",
            items: [
                {
                    id: 1,
                    name: "Inicio",
                    href: "/",
                    icon: "IoHomeOutline",
                    active: route().current("home"),
                    permissions: ["buscar inicio"],
                    subItems: []
                },
            ],
        },
    ];
};

export default Sidebar;
