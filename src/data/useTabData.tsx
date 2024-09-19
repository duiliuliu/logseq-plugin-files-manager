import { useEffect, useState } from "react";
import getI18nConstant from "../i18n/utils";
import { Tab } from "./types";
import { TAB_DATA_FN } from "./constants";

// 定义自定义钩子
const useTabData = (preferredLanguage: string) => {
    const initTabData = TAB_DATA_FN()
    const [tabData, setTabData] = useState<Tab[]>(initTabData);

    useEffect(() => {
        const fetchData = async () => {
            setTabData(initTabData.map(item => (
                {
                    ...item,
                    label: getI18nConstant(preferredLanguage, item.label as string)
                }
            )));
        };

        fetchData();
    }, [preferredLanguage]);

    return tabData;
};

export default useTabData;