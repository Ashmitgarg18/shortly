package com.ash.bitly.util;

import org.springframework.stereotype.Component;

@Component
public class Base62Encoder {
    private static final String CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public static String encode(long val){
        if (val < 0) val = Math.abs(val);

        StringBuilder sb = new StringBuilder();
        if (val == 0) return "a";

        while (val > 0){
            sb.append(CHARSET.charAt((int)(val % 62)));
            val /= 62;
        }
        return sb.reverse().toString();
    }

}

