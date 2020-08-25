/*
 * MIT License
 *
 * Copyright (c) 2020 Dataline
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package io.dataline.server.handlers;

import io.dataline.api.model.DestinationIdRequestBody;
import io.dataline.api.model.DestinationRead;
import io.dataline.api.model.DestinationReadList;
import io.dataline.config.StandardDestination;
import io.dataline.config.persistence.ConfigPersistence;
import io.dataline.server.helpers.ConfigFetchers;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class DestinationsHandler {
  private final ConfigPersistence configPersistence;

  public DestinationsHandler(ConfigPersistence configPersistence) {
    this.configPersistence = configPersistence;
  }

  public DestinationReadList listDestinations() {
    final List<DestinationRead> destinationReads;
    destinationReads =
        ConfigFetchers.getStandardDestinations(configPersistence).stream()
            .map(DestinationsHandler::toDestinationRead)
            .collect(Collectors.toList());

    final DestinationReadList destinationReadList = new DestinationReadList();
    destinationReadList.setDestinations(destinationReads);
    return destinationReadList;
  }

  public DestinationRead getDestination(DestinationIdRequestBody destinationIdRequestBody) {
    final UUID destinationId = destinationIdRequestBody.getDestinationId();
    final StandardDestination standardDestination =
        ConfigFetchers.getStandardDestination(configPersistence, destinationId);
    return toDestinationRead(standardDestination);
  }

  private static DestinationRead toDestinationRead(StandardDestination standardDestination) {
    final DestinationRead destinationRead = new DestinationRead();
    destinationRead.setDestinationId(standardDestination.getDestinationId());
    destinationRead.setName(standardDestination.getName());

    return destinationRead;
  }
}