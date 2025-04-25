import React, { useState, useRef, useEffect } from "react";
import styles from "./landingPage.module.css";
import { SiLinkedin } from "react-icons/si";
import { FileText, ChevronRight, ChevronDown, ChevronLeft, Menu } from "lucide-react";
import Popup from '../popups/popUp';
/* ─── navigation tree ────────────────────────────────── */
const navTree = [
  {
    label: "Welcome; Get Started",
    url: "https://rayyan-ashraf.notion.site/ebd/1dfcc74e579a80b9b46ce091c7cbafd6",
  },
  {
    label: "Natural Language Processing",
    url: "https://rayyan-ashraf.notion.site/ebd/1d8cc74e579a80998c55d1f7f53ada58",
    children: [
      {
        label: "Phases of Natural Language Processing",
        url: "https://rayyan-ashraf.notion.site/ebd/1dacc74e579a80ffacd7c0c6e8827a73",
        children: [
          {
            label: "Lexical & Morphological Analysis",
            url: "https://rayyan-ashraf.notion.site/ebd/1dacc74e579a809fa82bc25cafdc7f40",
          },
          {
            label: "Syntactic Analysis",
            url: "https://rayyan-ashraf.notion.site/ebd/1dbcc74e579a80b0925bce3c1fe79640",
          },
          {
            label: "Semantic Analysis",
            url: "https://rayyan-ashraf.notion.site/ebd/1ddcc74e579a803aafebc19cfe88b768",
          },
          {
            label: "Discourse Integration",
            url: "https://rayyan-ashraf.notion.site/ebd/1dfcc74e579a80ad8795fc059d2bdebb",
          },
          {
            label: "Pragmatic Analysis",
            url: "https://rayyan-ashraf.notion.site/ebd/1dfcc74e579a80478171fe81751449cd",
          },
        ],
      },
    ],
  },
  {
    label: "Vectorization Techniques",
    url: "https://rayyan-ashraf.notion.site/ebd/1dfcc74e579a803ba8b7dd88c727c445",
    children: [
      {
        label: "One-Hot Encoding",
        url: "https://rayyan-ashraf.notion.site/ebd/1d8cc74e579a806e99f5e8289faeefdd",
      },
    ],
  },
];

/* ─── helpers ────────────────────────────────────────── */
const flattenUrls = (nodes) =>
  nodes.reduce(
    (acc, n) => ({
      ...acc,
      [n.label]: n.url,
      ...flattenUrls(n.children || []),
    }),
    {}
  );

const treeToList = (nodes, parent = []) =>
  nodes.flatMap((n) => [
    { label: n.label, url: n.url, path: [...parent, n.label] },
    ...treeToList(n.children || [], [...parent, n.label]),
  ]);

const flatOptions = treeToList(navTree);
const urlLookup = flattenUrls(navTree);

/* ─── NavItem ────────────────────────────────────────── */
const NavItem = ({
  node,
  depth,
  active,
  setActive,
  collapsedMap,
  setCollapsedMap,
}) => {
  const hasKids = node.children?.length > 0;
  const collapsed = collapsedMap[node.label];

  return (
    <>
      <li
        className={`
            ${depth === 0 ? styles.super : styles.sub}
            ${active === node.label ? styles.active : ""}
          `}
        style={{ paddingLeft: 12 + depth * 16 }}
        onClick={() => setActive(node.label)}
      >
        {hasKids && (
          <span
            className={`${styles.chevron} ${collapsed ? "" : styles.rotated}`}
            onClick={(e) => {
              e.stopPropagation();
              setCollapsedMap((prev) => ({
                ...prev,
                [node.label]: !prev[node.label],
              }));
            }}
          >
            {collapsed ? (
              <ChevronRight size={16} color="gray" />
            ) : (
              <ChevronDown size={16} color="gray" />
            )}
          </span>
        )}
        <FileText size={16} color="darkgray" style={{ marginRight: 6 }} />
        <span className={styles.label}>{node.label}</span>
      </li>

      {hasKids &&
        !collapsed &&
        node.children.map((child) => (
          <NavItem
            key={child.label}
            node={child}
            depth={depth + 1}
            active={active}
            setActive={setActive}
            collapsedMap={collapsedMap}
            setCollapsedMap={setCollapsedMap}
          />
        ))}
    </>
  );
};

/* ─── LandingPage ───────────────────────────────────── */
const LandingPage = () => {
  const defaultLabel = navTree[0].label;
  const [active, setActive] = useState(defaultLabel);
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(250);
  const [collapsed, setCollapsed] = useState(false);

  const [collapsedMap, setCollapsedMap] = useState({});
  const startX = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      // Collapse sidebar if the viewport width is less than 1000px
      if (window.innerWidth < 1000) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Call handleResize on initial load to set correct state
    handleResize();

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const init = (nodes, map = {}) => {
      nodes.forEach((n) => {
        if (n.children?.length) map[n.label] = true;
        if (n.children) init(n.children, map);
      });
      return map;
    };
    setCollapsedMap(init(navTree));
  }, []);
  
  // const [showPopup, setShowPopup] = useState(false);

  // useEffect(() => {
  //   function notifyDarkModeRecommendation() {
  //     setShowPopup(true);
  //     alert(
  //       'Rayyan-Notion recommends using dark mode for a better experience.\n\n' +
  //       'To enable dark mode:\n' +
  //       '1. Click on the [ 3 vertical dots ] (⋮) in the top-right corner.\n' +
  //       '2. Click on [ Settings ].\n' +
  //       '3. Choose [ Appearance ] from the left sidebar.\n' +
  //       '4. In the [ Mode ] dropdown, select [ Dark ].'
  //     );
  //   }
  
  //   function detectColorScheme() {
  //     if (!window.matchMedia || !window.matchMedia('(prefers-color-scheme: dark)').matches) {
  //       notifyDarkModeRecommendation();
  //     }
  //   }
  
  //   // Listen for changes in the user's color scheme preference
  //   const colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //   const handleChange = (event) => {
  //     if (!event.matches) {
  //       notifyDarkModeRecommendation();
  //     }
  //   };
  //   colorSchemeMediaQuery.addEventListener('change', handleChange);
  
  //   // Initial check on page load
  //   detectColorScheme();
  
  //   // Cleanup the event listener on unmount
  //   return () => {
  //     colorSchemeMediaQuery.removeEventListener('change', handleChange);
  //   };
  // }, []);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    function notifyDarkModeRecommendation() {
      setShowPopup(true);
    }

    function detectColorScheme() {
      if (!window.matchMedia || !window.matchMedia('(prefers-color-scheme: dark)').matches) {
        notifyDarkModeRecommendation();
      }
    }

    const colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      if (!event.matches) {
        notifyDarkModeRecommendation();
      }
    };

    colorSchemeMediaQuery.addEventListener('change', handleChange);
    detectColorScheme();

    return () => {
      colorSchemeMediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const message = `Rayyan-Notion recommends using dark mode for a better experience.
                  To enable dark mode:
                  1. Click on the [ 3 vertical dots ] (⋮) in the top-right corner.
                  2. Click on [ Settings ].
                  3. Choose [ Appearance ] from the left sidebar.
                  4. In the [ Mode ] dropdown, select [ Dark ].`;


  const onDrag = (e) => {
    if (startX.current !== null) {
      const delta = e.clientX - startX.current;
      const newWidth = Math.min(400, Math.max(120, width + delta));
      setWidth(newWidth);
      startX.current = e.clientX;
    }
  };

  const stopDrag = () => (startX.current = null);

  const matches = flatOptions.filter((o) =>
    o.label.toLowerCase().includes(term.toLowerCase())
  );

  const handleSelect = (label) => {
    const match = flatOptions.find((o) => o.label === label);
    if (match) {
      setCollapsedMap((prev) => {
        const next = { ...prev };
        match.path.forEach((lbl) => {
          next[lbl] = false;
        });
        return next;
      });
      setActive(label);
    }
  };

  return (
    <div className={styles.wrapper} onMouseMove={onDrag} onMouseUp={stopDrag}>
      
      {/* ── sidebar ─────────────────────────────── */}
      <aside
        className={styles.sidebar}
        style={{ width: collapsed ? 60 : width }}
      >
        <button
          className={styles.toggleBtn}
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? (
            <Menu size={14} color="gray" />
          ) : (
            <ChevronLeft size={16} color="gray" />
          )}
        </button>

        {!collapsed && (
          <>
            <div className={styles.appIcon}>
              ꔰ <span className={styles.appTitle}>Rayyan's Notion</span>
            </div>

            <div className={styles.searchWrapper}>
              <input
                type="search"
                placeholder="Search Keywords..."
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => term && setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                className={styles.search}
              />
              {open && term && matches.length > 0 && (
                <ul className={styles.searchResults}>
                  {matches.slice(0, 20).map((m) => (
                    <li
                      key={m.label}
                      onMouseDown={() => {
                        handleSelect(m.label);
                        setTerm("");
                        setOpen(false);
                      }}
                    >
                      {m.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <nav className={styles.navSection}>
              <span className={styles.sectionTitle}>Public</span>
              <ul>
                {navTree.map((n) => (
                  <NavItem
                    key={n.label}
                    node={n}
                    depth={0}
                    active={active}
                    setActive={setActive}
                    collapsedMap={collapsedMap}
                    setCollapsedMap={setCollapsedMap}
                  />
                ))}
              </ul>
            </nav>
          </>
        )}

        {!collapsed && (
          <div
            className={styles.resizer}
            onMouseDown={(e) => (startX.current = e.clientX)}
          />
        )}
        {!collapsed && (
          <footer className={styles.footer}>
            © 2025 | &nbsp;{" "}
            <a
              href="https://www.linkedin.com/in/rayyan-ashraf/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiLinkedin />
              &nbsp;Connect
            </a> | v1.0.0
          </footer>
        )}
      </aside>

      {/* ── main panel ───────────────────────────── */}
      <main className={styles.main}>
        <section className={styles.iframeWrap}>
          <iframe
            src={urlLookup[active]}
            title={active}
            loading="lazy"
            className={styles.iframe}
          />
        </section>
        {showPopup && <Popup message={message} onClose={() => setShowPopup(false)} />}
      </main>
    </div>
  );
};

export default LandingPage;
