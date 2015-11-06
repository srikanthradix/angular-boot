package com.util;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public enum CollectionUtil {
	
	INSTANCE;
	
	public <T> List<T> emptyListIfNull(List<T> list) {
		return Optional.ofNullable(list)
			.orElse(new ArrayList<>());
	}
	
	public <T> Set<T> emptySetIfNull(Set<T> set) {
		return Optional.ofNullable(set)
			.orElse(new HashSet<>());
	}

}
