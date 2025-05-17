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

        const baseClasses = "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer transition-colors";
        const activeClasses = "bg-pink-400 text-black font-medium";
        const hoverClasses = "hover:bg-pink-300 hover:text-black";

        const iconColor = isActive ? "text-black" : "text-black group-hover:text-black";

        if (hasSubItems) {
            return (
                <div className={`mb-1 ${level > 0 ? 'ml-2' : ''}`}>
                    <div
                        onClick={(e) => handleMenuClick(item, e)}
                        className={`${baseClasses} ${isActive ? activeClasses : "text-black"} ${hoverClasses} group`}
                    >
                        <div className="flex items-center">
                            {Icon && <Icon className={`w-5 h-5 mr-3 ${iconColor}`} />}
                            <span>{item.name}</span>
                        </div>
                        <IoChevronForwardOutline
                            className={`w-4 h-4 transform transition-transform ${isExpanded ? "rotate-90" : ""} ${iconColor}`}
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
                className={`block px-3 py-2 text-sm rounded-md transition-colors ${item.active
                    ? "bg-pink-400 text-black font-medium"
                    : "text-black hover:bg-pink-300 hover:text-black"
                    } group`}
                onClick={closeSidebar}
            >
                <div className="flex items-center">
                    {Icon && <Icon className="w-5 h-5 mr-3 text-black group-hover:text-black" />}
                    <span>{item.name}</span>
                </div>
            </Link>
        );
    };

    return (
        <div className="flex h-full flex-col bg-[#ec4899] shadow-lg">
            {/* Cabecera */}
            <div className="flex h-16 shrink-0 items-center px-4 bg-[#ec4899] border-b border-pink-500">
                <Link href="/">
                    <img
                        src="/img/marca.png"
                        alt="Logo"
                        className="h-60 w-auto bg-[#ec4899] p-1 rounded"
                    />
                </Link>
            </div>

            {/* Mostrar error si ocurre */}
            {error && (
                <div className="flex flex-col p-4 bg-pink-100">
                    <div className="flex items-center text-black">
                        <IoAlertCircleOutline className="mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                    <button
                        onClick={retryFetch}
                        className="mt-2 flex items-center justify-center text-sm text-black hover:underline"
                    >
                        <IoReloadOutline className="mr-1" />
                        Reintentar
                    </button>
                </div>
            )}

            {/* Menú de navegación */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 bg-[#ec4899]">
                {navigation.length > 0 ? (
                    navigation.map((section) => (
                        <div key={`section-${section.group}`} className="mb-8">
                            <h3 className="px-2 text-xs font-semibold text-black uppercase tracking-wider">
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
                    <div className="text-center text-black py-4">
                        No tienes acceso a ningún módulo
                    </div>
                )}
            </nav>
        </div>
    );
};

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
