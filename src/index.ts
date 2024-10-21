import { type BinaryLike, createHash } from "crypto";
import bigInt from "big-integer";
import { adjectives, nouns } from "./particles";

interface ParticleMetadata {
	lengths: Record<number, number>;
}

interface ParticleInfo {
	items: string[];
	metadata?: ParticleMetadata;
}

interface Options {
	seed?: string | number | object;
	maxItemChars?: number;
	particles?: string[];
	adjectiveCount?: number;
	hashAlgorithm?: string;
	separator?: string;
	capitalize?: boolean;
	_isParsed?: boolean;
}

const allParticles: Record<string, ParticleInfo> = {
	adjective: {
		items: [...adjectives],
	},
	noun: {
		items: [...nouns],
	},
};

function parseParticles(particles: Record<string, string[]>) {
	function findLengths(items: string[]): Record<number, number> {
		const lengths = [3, 4, 5, 6, 7, 8, 9];
		const response: Record<number, number> = {};
		items.forEach((item) => {
			lengths.forEach((length) => {
				if (item.length <= length) {
					response[length] = (response[length] || 0) + 1;
				}
			});
		});
		return response;
	}

	if (typeof particles === "object" && !Array.isArray(particles)) {
		Object.entries(particles).forEach(([key, value]) => {
			const newValue = Array.from(value);
			allParticles[key] = {
				items: newValue.sort((a, b) =>
					a.length === b.length ? a.localeCompare(b) : a.length - b.length,
				),
				metadata: {
					lengths: findLengths(newValue),
				},
			};
		});
	}

	return allParticles;
}

function parseOptions(options: Options | string | number): Options {
	const response: Options = {};

	if (typeof options === "string" || typeof options === "number") {
		options = {
			seed: options,
		};
	}

	if (options._isParsed) {
		return options;
	}

	response.maxItemChars =
		options &&
		typeof options.maxItemChars === "number" &&
		options.maxItemChars > 0
			? Math.max(3, options.maxItemChars)
			: 0;

	if (response.maxItemChars > 9 || !response.maxItemChars) {
		response.maxItemChars = undefined;
	}

	if (options && Array.isArray(options.particles)) {
		response.particles = Array.from(options.particles);
	} else {
		// Classic mode
		response.particles =
			options && typeof options.adjectiveCount === "number"
				? new Array(options.adjectiveCount).fill("adjective")
				: ["adjective"];
		response.particles.push("noun");
	}

	response.seed = options?.seed || "";
	if (typeof response.seed === "number") {
		response.seed = response.seed.toString();
	} else if (typeof response.seed === "object") {
		response.seed = JSON.stringify(response.seed);
	}

	response.hashAlgorithm =
		options && typeof options.hashAlgorithm === "string"
			? options.hashAlgorithm
			: "md5";
	response.separator =
		options && typeof options.separator === "string" ? options.separator : "-";

	if (options && options.capitalize === true) {
		response.capitalize = options.capitalize;
	}

	response._isParsed = true;
	return response;
}

function getParticles(options: Options) {
	const useOptions = parseOptions(options);
	const response: string[][] = [];
	useOptions.particles?.reverse();
	useOptions.particles?.forEach((particle) => {
		if (!allParticles[particle]) {
			response.push(["unknown"]);
		} else {
			response.push(
				useOptions.maxItemChars
					? allParticles[particle].items.slice(
							0,
							allParticles[particle].metadata?.lengths[useOptions.maxItemChars],
						)
					: allParticles[particle].items,
			);
		}
	});
	return response;
}

function getTotalWords(particles: string[][]) {
	let totalWords = bigInt(1);
	particles.forEach((particle) => {
		totalWords = totalWords.multiply(bigInt(particle.length));
	});
	return totalWords;
}

function getHash(options: Options) {
	const useOptions = parseOptions(options);
	if (!useOptions.hashAlgorithm) {
		throw new Error("Missing hash algorithm");
	}
	const hash = createHash(useOptions.hashAlgorithm);
	hash.update(useOptions.seed as BinaryLike);
	const hashDigest = hash.digest("hex");
	return bigInt(hashDigest, 16).multiply("36413321723440003717");
}

function codenameParticles(options: Options) {
	const useOptions = parseOptions(options);
	const particles = getParticles(useOptions);
	const totalWords = getTotalWords(particles);
	const objHash = getHash(useOptions);

	let index = objHash.mod(totalWords);
	const codenameParticles: string[] = [];
	particles.forEach((particle) => {
		codenameParticles.push(particle[index.mod(particle.length).toJSNumber()]);
		index = index.divide(particle.length);
	});
	codenameParticles.reverse();

	return codenameParticles;
}

function codenamize(options: Options | string | number): string {
	const useOptions = parseOptions(options);
	let particles = codenameParticles(useOptions);

	if (useOptions.capitalize) {
		particles = particles.map(
			(particle) => particle.charAt(0).toUpperCase() + particle.slice(1),
		);
	}

	return particles.join(useOptions.separator);
}

codenamize.use = (particles: Record<string, string[]>) =>
	parseParticles(particles);

export default codenamize;
