package com.mapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.ParseException;

import org.springframework.stereotype.Service;

import com.domain.Department;
import com.domain.Employee;
import com.local.DeptSaveRequest;
import com.local.EmplSaveRequest;

import ma.glasnost.orika.CustomConverter;
import ma.glasnost.orika.MapperFactory;
import ma.glasnost.orika.impl.ConfigurableMapper;
import ma.glasnost.orika.impl.DefaultMapperFactory;
import ma.glasnost.orika.metadata.Type;

@Service
public class OrikaCustomMapper extends ConfigurableMapper {
	
	private static final ThreadLocal<DecimalFormat> BD_DECIMAL_FORMAT = new ThreadLocal<DecimalFormat>() {
		// Create a DecimalFormat that fits your requirements
    	DecimalFormatSymbols symbols = new DecimalFormatSymbols();
    	
		@Override
        protected DecimalFormat initialValue() {
			symbols.setGroupingSeparator(',');
	    	symbols.setDecimalSeparator('.');
	    	String pattern = "#,##0.0#";
	    	DecimalFormat decimalFormat = new DecimalFormat(pattern, symbols);
	    	decimalFormat.setParseBigDecimal(true);
	    	return decimalFormat;
        }
	};

	@Override
	public void configure(MapperFactory mapperFactory) {
		// register class maps, Mappers, ObjectFactories, and Converters
		mapperFactory.registerClassMap(
				mapperFactory.classMap(EmplSaveRequest.class, Employee.class)
				.field("mgr_id", "mgrId")
				.field("dept", "department.name")
				.byDefault()
				.toClassMap());
		
		mapperFactory.registerClassMap(
				mapperFactory.classMap(DeptSaveRequest.class, Department.class)
				.byDefault()
				.toClassMap());

		mapperFactory.getConverterFactory().registerConverter(stringToBdConverter());
	}

	private static CustomConverter<String, BigDecimal> stringToBdConverter() {
		return new CustomConverter<String, BigDecimal>() {

			@Override
			public BigDecimal convert(String source, Type<? extends BigDecimal> destinationType) {
				try {
					BigDecimal bd = (BigDecimal) BD_DECIMAL_FORMAT.get().parse(source);
					return bd.setScale(2, RoundingMode.HALF_UP);
				} catch (ParseException e) {
					throw new RuntimeException(e);
				}
			}
		};
	}

	@Override
	public void configureFactoryBuilder(DefaultMapperFactory.Builder builder) {
		// configure properties of the factory, if needed
	}
}
