
/**
 * Computes the maximal of three integers.
 *
 * @ensures ((ret == x) || (ret == y) || (ret == z))
 *            && (ret <= x) && (ret <= y) && (ret <= z)
 */
int max3_v1(int x, int y, int z) {
    if (x < y) {
        if (x < z) return x;
        else return z;
    }
    else {
        if (y < z) return y;
        else return z;
    }
}

/**
 * (same)
 */
int max3_v2(int x, int y, int z) {
    if (x < y) {
        if (x < z) return x;
    }
    else {
        if (y < z) return y;
    }
    return z;
}

/**
 * (still same)
 */
int max3_v3(int x, int y, int z) {
    int tmp = x;
    if (y < tmp) tmp = y;
    if (z < tmp) tmp = z;
    return tmp;
}
