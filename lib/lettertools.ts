import { Letter } from "@/types/types"

enum Platform {
    WALRUS = 'walrus',
    TUSKY = 'tusky',
}

// 定义获取letter的配置接口
interface FetchConfig {
    platform: Platform;
    baseUrl: string;
    headers?: Record<string, string>;
    timeout?: number;
}

// 默认配置
const DEFAULT_CONFIG: FetchConfig = {
    platform: Platform.WALRUS,
    baseUrl: 'https://api.letterx.com/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 5000
};

// 获取letter的通用函数
async function fetchLetters(config: Partial<FetchConfig> = {}): Promise<Letter[]> {
    const mergedConfig: FetchConfig = { ...DEFAULT_CONFIG, ...config };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), mergedConfig.timeout);

        const response = await fetch(`${mergedConfig.baseUrl}/letters`, {
            method: 'GET',
            headers: mergedConfig.headers,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // 验证数据格式
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format: expected an array of letters');
        }

        // 转换日期字符串为Date对象
        return data.map(letter => ({
            ...letter,
            deliveryDate: new Date(letter.deliveryDate)
        }));
    } catch (error) {
        console.error(`Failed to fetch letters from ${mergedConfig.platform}:`, error);
        throw error;
    }
}

// 平台特定的获取函数
export async function getWalrusLetters(): Promise<Letter[]> {
    return fetchLetters({
        platform: Platform.WALRUS,
        baseUrl: 'https://web.letterx.com/api'
    });
}

export async function getTuskyLetters(): Promise<Letter[]> {
    return fetchLetters({
        platform: Platform.TUSKY,
        baseUrl: 'https://mobile.letterx.com/api',
        headers: {
            'User-Agent': 'LetterX-Mobile/1.0'
        }
    });
}

export async function getPublicLetters(): Promise<Letter[]> {
    try {
        // 并行获取两个平台的letters
        const [walrusLetters, tuskyLetters] = await Promise.all([
            getWalrusLetters(),
            getTuskyLetters()
        ]);

        // 合并并去重（基于letter.id）
        const uniqueLetters = new Map<string, Letter>();
        [...walrusLetters, ...tuskyLetters].forEach(letter => {
            if (!uniqueLetters.has(letter.id)) {
                uniqueLetters.set(letter.id, letter);
            }
        });

        return Array.from(uniqueLetters.values());
    } catch (error) {
        console.error('Error fetching public letters:', error);
        throw error;
    }
}


export async function getMyLetters(): Promise<Letter[]> {
    try {
        const response = await fetch('/api/letters/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('Invalid data format: expected an array of letters');
        }

        // 转换日期并过滤出当前用户的信件
        return data.map(letter => ({
            ...letter,
            deliveryDate: new Date(letter.deliveryDate)
        })).filter(letter =>
            letter.ownerId === localStorage.getItem('userId') ||
            letter.recipients.includes(localStorage.getItem('userEmail'))
        );

    } catch (error) {
        console.error('Error fetching user letters:', error);
        throw error;
    }
}
// 使用示例
// async function exampleUsage() {
//     try {
//         const webLetters = await getWebLetters();
//         console.log('Web letters:', webLetters);

//         const mobileLetters = await getMobileLetters();
//         console.log('Mobile letters:', mobileLetters);
//     } catch (error) {
//         console.error('Error fetching letters:', error);
//     }
// }

// ... existing imports ...

export async function getLetterById(id: string, shouldParseJson: boolean = false, aggregatorUrl: string = "https://aggregator.walrus-testnet.walrus.space") {
    try {
        const response = await fetch(`${aggregatorUrl}/v1/blobs/by-object-id/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 根据参数决定返回格式
        if (shouldParseJson) {
            return await response.json();
        } else {
            return await response.arrayBuffer(); // 比bytes()更标准的API
        }
    } catch (error) {
        console.error(`Failed to fetch letter ${id}:`, error);
        return null;
    }
}


getLetterById(
    "0xfa18be1a703bb4fc331d03558fcf896c19ccaec4dee57d9614817bdea9937ef7",
    true,
    "https://aggregator.walrus-testnet.walrus.space").then(console.log);

